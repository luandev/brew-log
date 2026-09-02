#!/usr/bin/env ruby
# frozen_string_literal: true

require "date"
require "json"
require "yaml"
require "fileutils"
require "date"

ROOT = File.expand_path("..", __dir__)
BREWS_DIR = File.join(ROOT, "brews")
DATA_DIR = File.join(ROOT, "_data")
BATCHES_OUTPUT = File.join(DATA_DIR, "batches.json")
SCHEDULE_OUTPUT = File.join(DATA_DIR, "schedule.json")
CALENDAR_OUTPUT = File.join(DATA_DIR, "calendar.json")

INACTIVE_STATUSES = %w[finished failed archived].freeze
DEFAULT_TARGET_DAYS = 28

def parse_front_matter(path)
  content = File.read(path, encoding: "UTF-8")
  return {} unless content.start_with?("---")

  parts = content.split("---", 3)
  return {} if parts.length < 3

  YAML.safe_load(parts[1], permitted_classes: [Date, Time], aliases: true) || {}
rescue StandardError => e
  warn "Warning: could not parse front matter in #{path}: #{e.message}"
  {}
end

def read_file(path)
  File.exist?(path) ? File.read(path, encoding: "UTF-8") : ""
end

def parse_date(value)
  return nil if value.nil? || value.to_s.strip.empty?

  Date.parse(value.to_s)
rescue ArgumentError
  nil
end

def parse_schedule_rows(schedule_content)
  rows = []
  schedule_content.each_line do |line|
    next unless line.strip.start_with?("|")
    next if line.include?("---") || line.include?("Date")

    cells = line.split("|").map(&:strip).reject(&:empty?)
    next if cells.length < 3

    date, action, status = cells[0], cells[1], cells[2]
    next if date.empty? || action.empty?

    rows << { "date" => date, "action" => action, "status" => status }
  end
  rows
end

def parse_stage_rows(stages_content)
  rows = []
  stages_content.each_line do |line|
    next unless line.strip.start_with?("|")
    next if line.match?(/\A\|\s*-+\s*\|/) || line.include?("Stage")

    cells = line.split("|").map(&:strip)
    cells = cells[1..-2] if cells.first&.empty?
    next if cells.nil? || cells.length < 4

    stage, started, ended, status = cells[0], cells[1], cells[2], cells[3]
    next if stage.empty?

    rows << { "stage" => stage, "started" => started, "ended" => ended, "status" => status }
  end
  rows
end

def load_status_catalog
  path = File.join(DATA_DIR, "statuses.json")
  return { "ids" => {}, "entries" => [] } unless File.exist?(path)

  entries = JSON.parse(File.read(path))
  labels = entries.each_with_object({}) { |entry, lookup| lookup[entry["id"]] = entry["label"] }
  { "ids" => labels, "entries" => entries }
rescue StandardError
  { "ids" => {}, "entries" => [] }
end

def load_status_labels
  load_status_catalog["ids"]
end

def validate_batch(batch_id, metadata, stage_rows, schedule_rows, status_catalog)
  status_ids = status_catalog["ids"].keys
  status_entries = status_catalog["entries"].each_with_object({}) { |entry, lookup| lookup[entry["id"]] = entry }
  batch_status = metadata["status"].to_s
  is_active = !INACTIVE_STATUSES.include?(batch_status)

  stage_rows.each do |row|
    unless status_ids.include?(row["stage"])
      warn "#{batch_id}: unknown stage ID '#{row["stage"]}' in stages.md"
    end
  end

  active_rows = stage_rows.select { |row| row["status"]&.casecmp("active")&.zero? }
  if active_rows.length > 1
    warn "#{batch_id}: stages.md has #{active_rows.length} active rows; expected at most one"
  end

  if is_active
    if active_rows.empty?
      warn "#{batch_id}: active batch has no active stage row in stages.md"
    elsif active_rows.length == 1
      active = active_rows.first
      if batch_status != active["stage"]
        warn "#{batch_id}: README status '#{batch_status}' does not match active stage '#{active["stage"]}'"
      end
      if active["started"].to_s.strip.empty?
        warn "#{batch_id}: active stage '#{active["stage"]}' is missing Started date in stages.md"
      end

      next_ids = status_entries[active["stage"]]&.fetch("next", []) || []
      planned_stages = stage_rows.select { |row| row["status"]&.casecmp("planned")&.zero? }.map { |row| row["stage"] }
      unless (planned_stages & next_ids).any?
        warn "#{batch_id}: no planned next stage from Status Guide (expected one of: #{next_ids.join(', ')})"
      end

      pending_count = schedule_rows.count { |row| row["status"]&.casecmp("pending")&.zero? }
      if pending_count.zero?
        warn "#{batch_id}: no Pending schedule rows for active stage '#{active["stage"]}'"
      end
    end
  end

  stage_rows.each do |row|
    next unless row["status"]&.casecmp("completed")&.zero?

    if row["started"].to_s.strip.empty? || row["ended"].to_s.strip.empty?
      warn "#{batch_id}: completed stage '#{row["stage"]}' must have both Started and Ended dates"
    end
  end
end

def stage_label(stage_id, status_lookup)
  status_lookup[stage_id] || stage_id.tr("-", " ").split.map(&:capitalize).join(" ")
end

def next_pending_action(rows)
  rows.find { |row| row["status"]&.casecmp("pending")&.zero? }
end

def pending_schedule_rows(rows)
  rows.select { |row| row["status"]&.casecmp("pending")&.zero? }
end

def last_log_date(log_content)
  log_content.scan(/^##\s+(\d{4}-\d{2}-\d{2})/).flatten.max
end

def latest_log_excerpt(log_content)
  sections = log_content.split(/^##\s+\d{4}-\d{2}-\d{2}/)
  return nil if sections.length < 2

  latest = sections.last
  if latest =~ /### Observation\s*\n+([\s\S]*?)(\n###|\z)/
    excerpt = Regexp.last_match(1).strip
    excerpt = excerpt.gsub(/\n+/, " ")
    return excerpt[0, 200] unless excerpt.empty?
  end

  nil
end

def extract_log_section(body, heading)
  pattern = /###\s+#{Regexp.escape(heading)}\s*\n+([\s\S]*?)(?=\n###\s+|\z)/i
  match = body.match(pattern)
  return nil unless match

  text = match[1].strip
  text.empty? ? nil : text
end

def parse_log_entries(log_content)
  return [] if log_content.nil? || log_content.strip.empty?

  entries = []
  parts = log_content.split(/^##\s+/)
  parts.each do |part|
    next if part.strip.empty? || part.start_with?("#")

    lines = part.lines
    heading = lines.shift.to_s.strip
    next if heading.empty?

    date = nil
    day_label = nil
    if heading =~ /\A(\d{4}-\d{2}-\d{2})\s*[—–-]\s*(.+)\z/
      date = Regexp.last_match(1)
      day_label = Regexp.last_match(2).strip
    elsif heading =~ /\A(\d{4}-\d{2}-\d{2})\z/
      date = Regexp.last_match(1)
    else
      next
    end

    body = lines.join
    stage = nil
    if body =~ /\*\*Stage:\*\*\s*(.+?)(?:\n|\z)/
      stage = Regexp.last_match(1).strip
      stage = nil if stage.empty?
    end

    observation = extract_log_section(body, "Observation")
    entries << {
      "date" => date,
      "day_label" => day_label,
      "heading" => heading,
      "stage" => stage,
      "measurements" => extract_log_section(body, "Measurements"),
      "actions" => extract_log_section(body, "Actions"),
      "observation" => observation,
      "next" => extract_log_section(body, "Next"),
      "excerpt" => observation&.gsub(/\n+/, " ")&.slice(0, 220)
    }
  end

  entries
end

def infer_target_days(started_date, pending_rows, explicit_target)
  return explicit_target.to_i if explicit_target && explicit_target.to_i.positive?

  if started_date && pending_rows.any?
  latest_pending = pending_rows.map { |r| parse_date(r["date"]) }.compact.max
    if latest_pending
      days = (latest_pending - started_date).to_i + 7
      return days if days.positive?
    end
  end

  DEFAULT_TARGET_DAYS
end

def compute_progress(days_elapsed, target_days)
  return 0 if target_days.nil? || target_days <= 0

  percent = (days_elapsed.to_f / target_days * 100).round
  [percent, 100].min
end

def find_batch_readmes
  Dir.glob(File.join(BREWS_DIR, "*", "*", "README.md")).sort
end

today = Date.today
status_catalog = load_status_catalog
status_lookup = status_catalog["ids"]
batches = []
schedule_entries = []
calendar_stages = []

find_batch_readmes.each do |readme_path|
  folder = File.dirname(readme_path)
  folder_name = File.basename(folder)
  year = File.basename(File.dirname(folder))

  metadata = parse_front_matter(readme_path)
  batch_id = metadata["batch_id"]
  status = metadata["status"].to_s

  next if batch_id.nil? || batch_id.empty?

  schedule_content = read_file(File.join(folder, "schedule.md"))
  stages_content = read_file(File.join(folder, "stages.md"))
  log_content = read_file(File.join(folder, "log.md"))
  schedule_rows = parse_schedule_rows(schedule_content)
  stage_rows = parse_stage_rows(stages_content)
  validate_batch(batch_id, metadata, stage_rows, schedule_rows, status_catalog)
  pending = next_pending_action(schedule_rows)
  pending_rows = pending_schedule_rows(schedule_rows)

  started_date = parse_date(metadata["started"])
  days_elapsed = started_date ? (today - started_date).to_i : 0
  target_days = infer_target_days(started_date, pending_rows, metadata["target_days"])
  progress_percent = compute_progress(days_elapsed, target_days)

  batch_type = metadata["type"].to_s
  thumbnail = metadata["thumbnail"].to_s

  entry = metadata.transform_keys(&:to_s)
  entry["folder"] = folder.sub("#{ROOT}/", "").tr("\\", "/")
  entry["year"] = year
  entry["slug"] = folder_name
  entry["url"] = "/brews/#{batch_id}/"
  entry["is_active"] = !INACTIVE_STATUSES.include?(status)
  entry["last_log_date"] = last_log_date(log_content)
  entry["latest_log_excerpt"] = latest_log_excerpt(log_content)
  entry["log_entries"] = parse_log_entries(log_content)
  entry["pending_schedule"] = pending_rows
  entry["schedule"] = schedule_rows
  entry["stages"] = stage_rows.map do |row|
    row.merge("label" => stage_label(row["stage"], status_lookup))
  end
  active_stage_row = stage_rows.find { |row| row["status"]&.casecmp("active")&.zero? }
  if active_stage_row
    entry["current_stage"] = active_stage_row["stage"]
    entry["current_stage_label"] = stage_label(active_stage_row["stage"], status_lookup)
  end
  entry["days_elapsed"] = days_elapsed
  entry["target_days"] = target_days
  entry["progress_percent"] = progress_percent
  entry["thumbnail"] = thumbnail

  if pending
    entry["next_action_date"] = pending["date"]
    entry["next_action"] = pending["action"]
  end

  if started_date && target_days.positive?
    entry["end_date"] = (started_date + target_days).strftime("%Y-%m-%d")
  end

  if entry["is_active"]
    pending_rows.each do |row|
      schedule_entries << {
        "date" => row["date"],
        "action" => row["action"],
        "batch_id" => batch_id,
        "name" => entry["name"],
        "url" => entry["url"]
      }
    end

    stage_rows.each do |row|
      start_date = parse_date(row["started"])
      next unless start_date

      calendar_stages << {
        "batch_id" => batch_id,
        "name" => entry["name"],
        "url" => entry["url"],
        "type" => entry["type"],
        "stage" => row["stage"],
        "label" => stage_label(row["stage"], status_lookup),
        "started" => start_date.strftime("%Y-%m-%d"),
        "ended" => parse_date(row["ended"])&.strftime("%Y-%m-%d"),
        "status" => row["status"]
      }
    end
  end

  batches << entry
end

batches.sort_by! { |b| [b["started"].to_s, b["batch_id"].to_s] }.reverse!
schedule_entries.sort_by! { |e| [e["date"].to_s, e["batch_id"].to_s] }

active_batches = batches.select { |b| b["is_active"] }.map do |b|
  {
    "batch_id" => b["batch_id"],
    "name" => b["name"],
    "url" => b["url"],
    "type" => b["type"],
    "status" => b["status"],
    "current_stage" => b["current_stage"],
    "current_stage_label" => b["current_stage_label"],
    "started" => b["started"],
    "end_date" => b["end_date"],
    "target_days" => b["target_days"]
  }
end

calendar_stages.sort_by! { |s| [s["started"], s["batch_id"], s["stage"]] }

calendar_data = {
  "today" => today.strftime("%Y-%m-%d"),
  "batches" => active_batches,
  "stages" => calendar_stages,
  "tasks" => schedule_entries
}

FileUtils.mkdir_p(DATA_DIR)
File.write(BATCHES_OUTPUT, JSON.pretty_generate(batches))
File.write(SCHEDULE_OUTPUT, JSON.pretty_generate(schedule_entries))
File.write(CALENDAR_OUTPUT, JSON.pretty_generate(calendar_data))

puts "Generated #{BATCHES_OUTPUT} with #{batches.length} batch(es)."
puts "Generated #{SCHEDULE_OUTPUT} with #{schedule_entries.length} pending task(s)."
puts "Generated #{CALENDAR_OUTPUT} with #{calendar_stages.length} stage span(s)."

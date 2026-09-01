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
batches = []
schedule_entries = []

find_batch_readmes.each do |readme_path|
  folder = File.dirname(readme_path)
  folder_name = File.basename(folder)
  year = File.basename(File.dirname(folder))

  metadata = parse_front_matter(readme_path)
  batch_id = metadata["batch_id"]
  status = metadata["status"].to_s

  next if batch_id.nil? || batch_id.empty?

  schedule_content = read_file(File.join(folder, "schedule.md"))
  log_content = read_file(File.join(folder, "log.md"))
  schedule_rows = parse_schedule_rows(schedule_content)
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
  entry["pending_schedule"] = pending_rows
  entry["days_elapsed"] = days_elapsed
  entry["target_days"] = target_days
  entry["progress_percent"] = progress_percent
  entry["thumbnail"] = thumbnail

  if pending
    entry["next_action_date"] = pending["date"]
    entry["next_action"] = pending["action"]
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
  end

  batches << entry
end

batches.sort_by! { |b| [b["started"].to_s, b["batch_id"].to_s] }.reverse!
schedule_entries.sort_by! { |e| [e["date"].to_s, e["batch_id"].to_s] }

FileUtils.mkdir_p(DATA_DIR)
File.write(BATCHES_OUTPUT, JSON.pretty_generate(batches))
File.write(SCHEDULE_OUTPUT, JSON.pretty_generate(schedule_entries))

puts "Generated #{BATCHES_OUTPUT} with #{batches.length} batch(es)."
puts "Generated #{SCHEDULE_OUTPUT} with #{schedule_entries.length} pending task(s)."

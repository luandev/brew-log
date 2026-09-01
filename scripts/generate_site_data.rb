#!/usr/bin/env ruby
# frozen_string_literal: true

require "json"
require "yaml"
require "fileutils"

ROOT = File.expand_path("..", __dir__)
BREWS_DIR = File.join(ROOT, "brews")
OUTPUT = File.join(ROOT, "_data", "batches.json")

INACTIVE_STATUSES = %w[finished failed archived].freeze

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

def next_pending_action(schedule_content)
  schedule_content.each_line do |line|
    next unless line.strip.start_with?("|")
    next if line.include?("---") || line.include?("Date")

    cells = line.split("|").map(&:strip).reject(&:empty?)
    next if cells.length < 3

    date, action, status = cells[0], cells[1], cells[2]
    next unless status&.casecmp("pending")&.zero?

    return { "next_action_date" => date, "next_action" => action }
  end

  nil
end

def last_log_date(log_content)
  dates = log_content.scan(/^##\s+(\d{4}-\d{2}-\d{2})/).flatten
  dates.max
end

def find_batch_readmes
  Dir.glob(File.join(BREWS_DIR, "*", "*", "README.md")).sort
end

batches = find_batch_readmes.filter_map do |readme_path|
  folder = File.dirname(readme_path)
  folder_name = File.basename(folder)
  year = File.basename(File.dirname(folder))

  metadata = parse_front_matter(readme_path)
  batch_id = metadata["batch_id"]
  status = metadata["status"].to_s

  next if batch_id.nil? || batch_id.empty?

  schedule = read_file(File.join(folder, "schedule.md"))
  log = read_file(File.join(folder, "log.md"))
  pending = next_pending_action(schedule)

  entry = metadata.transform_keys(&:to_s)
  entry["folder"] = folder.sub("#{ROOT}/", "").tr("\\", "/")
  entry["year"] = year
  entry["slug"] = folder_name
  entry["url"] = "/brews/#{batch_id}/"
  entry["is_active"] = !INACTIVE_STATUSES.include?(status)
  entry["last_log_date"] = last_log_date(log)

  if pending
    entry["next_action_date"] = pending["next_action_date"]
    entry["next_action"] = pending["next_action"]
  end

  entry
end

batches.sort_by! { |b| [b["started"].to_s, b["batch_id"].to_s] }.reverse!

FileUtils.mkdir_p(File.dirname(OUTPUT))
File.write(OUTPUT, JSON.pretty_generate(batches))

puts "Generated #{OUTPUT} with #{batches.length} batch(es)."

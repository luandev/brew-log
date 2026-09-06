export type LogEntry = {
  date: string;
  day_label?: string | null;
  heading: string;
  stage?: string | null;
  measurements?: string | null;
  actions?: string | null;
  observation?: string | null;
  next?: string | null;
  excerpt?: string | null;
};

export type ScheduleRow = {
  date: string;
  action: string;
  status: string;
};

export type StageRow = {
  stage: string;
  started: string;
  ended: string;
  status: string;
  label: string;
};

export type Batch = {
  batch_id: string;
  name: string;
  title?: string;
  type: string;
  status: string;
  started: string;
  volume_l?: number | null;
  target_abv?: number | null;
  actual_abv?: number | null;
  tags?: string[];
  permalink: string;
  url: string;
  is_active: boolean;
  last_log_date?: string | null;
  latest_log_excerpt?: string | null;
  log_entries: LogEntry[];
  pending_schedule: ScheduleRow[];
  schedule: ScheduleRow[];
  stages: StageRow[];
  current_stage?: string;
  current_stage_label?: string;
  days_elapsed: number;
  target_days: number;
  progress_percent: number;
  thumbnail?: string;
  accent: string;
  next_action?: string;
  next_action_date?: string;
  end_date?: string;
  recipe_markdown?: string;
  tasting_markdown?: string;
  media_markdown?: string;
  summary_markdown?: string;
};

export type ScheduleTask = {
  date: string;
  action: string;
  batch_id: string;
  name: string;
  url: string;
  accent?: string;
};

export type CalendarStage = {
  batch_id: string;
  name: string;
  url: string;
  type: string;
  stage: string;
  label: string;
  started: string;
  ended?: string | null;
  status: string;
  accent: string;
};

export type CalendarBatch = {
  batch_id: string;
  name: string;
  url: string;
  type: string;
  status: string;
  current_stage?: string;
  current_stage_label?: string;
  started: string;
  end_date?: string;
  target_days?: number;
  accent: string;
};

export type CalendarData = {
  today: string;
  batches: CalendarBatch[];
  stages: CalendarStage[];
  tasks: ScheduleTask[];
};

export type StatusInfo = {
  id: string;
  label: string;
  phase: string;
  description: string;
  recipe_section: string;
  log_focus: string;
  schedule_focus: string;
  next: string[];
  active: boolean;
};

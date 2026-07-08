-- AvidKiya Platform Seed Data

-- Default admin license
INSERT INTO licenses (id, code, plan, status, is_admin, name) 
VALUES ('admin-001', 'KIYA-ADMIN-0000-0001', 'team', 'active', 1, 'Admin');

-- Default plans
INSERT INTO plans (id, name, price_monthly, price_yearly, features, highlighted)
VALUES 
  ('free', 'Free', 0, 0, '["50 captures/month", "10 AI messages/day", "50 tasks", "5 goals", "5 habits", "30-day memory"]', 0),
  ('pro', 'Pro', 9.99, 99, '["Unlimited tasks", "Unlimited goals", "Unlimited habits", "Knowledge Graph", "500 captures/month", "50 AI messages/day", "90-day memory"]', 1),
  ('pro-ai', 'Pro+AI', 14.99, 149, '["Everything in Pro", "Unlimited AI", "Finance module", "Health module", "Priority support", "1-year memory"]', 0),
  ('team', 'Team', 29.99, 299, '["Everything in Pro+AI", "5 team members", "Shared workspace", "Team analytics", "Admin panel"]', 0);
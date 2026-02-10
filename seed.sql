-- Minimal seed data for local development

INSERT INTO public.users (id, email, created_at, name, password_hash)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'demo@coincontrol.local', now(), 'Demo User', '$argon2id$v=19$m=19456,t=2,p=1$tC4hsAKKAvGsFspaw03pUw$LDDomOkp2QsdF+WZ/5l8xpo6VpXhCRHYbcH5uSJQxfc'),
  ('00000000-0000-0000-0000-000000000011', 'ava.bennett@example.test', now(), 'Ava Bennett', null),
  ('00000000-0000-0000-0000-000000000012', 'liam.carter@example.test', now(), 'Liam Carter', null),
  ('00000000-0000-0000-0000-000000000013', 'noah.kim@example.test', now(), 'Noah Kim', null)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.user_emails (email_id, user_id, email, is_primary, is_verified)
VALUES
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'demo@coincontrol.local', true, true),
  ('00000000-0000-0000-0000-000000000021', '00000000-0000-0000-0000-000000000011', 'ava.bennett@example.test', true, true),
  ('00000000-0000-0000-0000-000000000022', '00000000-0000-0000-0000-000000000012', 'liam.carter@example.test', true, true),
  ('00000000-0000-0000-0000-000000000023', '00000000-0000-0000-0000-000000000013', 'noah.kim@example.test', true, true)
ON CONFLICT (email) DO NOTHING;

INSERT INTO public.transactions (transaction_id, user_id, transaction_date, amount, description, category)
VALUES
  ('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000001', now(), 25.50, 'Coffee and pastry', 'foodAndDrink'),
  ('00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000001', now() - interval '2 days', 80.00, 'Grocery run', 'groceries'),
  ('00000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000001', now() - interval '5 days', 1200.00, 'Salary', 'income'),
  ('00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000011', now() - interval '1 days', 12.40, 'Metro ticket', 'transportation'),
  ('00000000-0000-0000-0000-000000000202', '00000000-0000-0000-0000-000000000011', now() - interval '4 days', 45.90, 'Dinner out', 'foodAndDrink'),
  ('00000000-0000-0000-0000-000000000203', '00000000-0000-0000-0000-000000000011', now() - interval '8 days', 950.00, 'Freelance project', 'income'),
  ('00000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000012', now() - interval '3 days', 62.75, 'Household supplies', 'utilities'),
  ('00000000-0000-0000-0000-000000000302', '00000000-0000-0000-0000-000000000012', now() - interval '6 days', 210.00, 'New shoes', 'shopping'),
  ('00000000-0000-0000-0000-000000000303', '00000000-0000-0000-0000-000000000012', now() - interval '12 days', 1500.00, 'Paycheck', 'income'),
  ('00000000-0000-0000-0000-000000000401', '00000000-0000-0000-0000-000000000013', now() - interval '2 days', 35.20, 'Groceries', 'groceries'),
  ('00000000-0000-0000-0000-000000000402', '00000000-0000-0000-0000-000000000013', now() - interval '9 days', 620.00, 'Rent contribution', 'housing'),
  ('00000000-0000-0000-0000-000000000403', '00000000-0000-0000-0000-000000000013', now() - interval '14 days', 120.00, 'Ride share and taxis', 'transportation')
ON CONFLICT (transaction_id) DO NOTHING;

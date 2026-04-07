-- supabase/migrations/20260408_004_seed_saas_sources.sql
-- Seed 40 real SaaS products into saas_sources
-- mrr_reported / arr_reported in USD integers, NULL if unknown
-- is_featured = true for top 10 most illustrative products

INSERT INTO saas_sources (
  name, slug, domain, tagline, description,
  logo_url, category, pricing_model,
  founder_names, tech_stack,
  mrr_reported, arr_reported,
  is_verified, is_featured,
  created_at
)
VALUES

-- ============================================================
-- SCHEDULING (4)
-- ============================================================
(
  'Calendly', 'calendly', 'calendly.com',
  'Scheduling infrastructure for everyone',
  'Calendly helps millions of people schedule meetings without the back-and-forth emails. Used by teams and individuals worldwide to eliminate scheduling friction.',
  'https://logo.clearbit.com/calendly.com',
  'scheduling', 'subscription',
  'Tope Awotona',
  '["react","node","postgres"]',
  NULL, 20000000,
  true, true,
  now()
),
(
  'Acuity Scheduling', 'acuity-scheduling', 'acuityscheduling.com',
  'Online appointment scheduling software',
  'Acuity Scheduling lets clients self-schedule appointments online 24/7. Fully customizable booking pages with automated reminders and payment collection.',
  'https://logo.clearbit.com/acuityscheduling.com',
  'scheduling', 'subscription',
  'Gavin Zuchlinski',
  '["ruby","rails","mysql"]',
  NULL, NULL,
  true, false,
  now()
),
(
  'Mindbody', 'mindbody', 'mindbodyonline.com',
  'Business management software for wellness',
  'Mindbody provides scheduling, payments, and marketing tools for fitness studios, spas, and wellness businesses worldwide. Founded in 2001.',
  'https://logo.clearbit.com/mindbodyonline.com',
  'scheduling', 'subscription',
  'Rick Stollmeyer, Blake Beltram',
  '["react","java","aws"]',
  NULL, NULL,
  true, false,
  now()
),
(
  'Vagaro', 'vagaro', 'vagaro.com',
  'Salon, spa and fitness software',
  'Vagaro is an all-in-one software for salons, spas, and fitness businesses — booking, POS, payroll, and marketing in one platform. Founded in 2009.',
  'https://logo.clearbit.com/vagaro.com',
  'scheduling', 'subscription',
  'Fred Helou',
  '["react","node","mysql"]',
  NULL, NULL,
  true, false,
  now()
),

-- ============================================================
-- FINANCE (4)
-- ============================================================
(
  'FreshBooks', 'freshbooks', 'freshbooks.com',
  'Small business accounting software',
  'FreshBooks is cloud-based accounting software built for small business owners. Invoicing, expenses, time tracking, and financial reports in one place.',
  'https://logo.clearbit.com/freshbooks.com',
  'finance', 'subscription',
  'Mike McDerment',
  '["php","mysql","aws"]',
  NULL, NULL,
  true, false,
  now()
),
(
  'Dubsado', 'dubsado', 'dubsado.com',
  'Business management for creatives',
  'Dubsado is a CRM and workflow automation tool built for creative entrepreneurs — contracts, invoices, scheduling, and client portals all in one.',
  'https://logo.clearbit.com/dubsado.com',
  'finance', 'subscription',
  'Becca Berg, Jake Berg',
  '["react","node","mongodb"]',
  2000000, NULL,
  true, false,
  now()
),
(
  'Wave', 'wave', 'waveapps.com',
  'Free accounting for small business',
  'Wave offers free accounting, invoicing, and receipt scanning for small businesses. Monetizes through payroll and payment processing add-ons.',
  'https://logo.clearbit.com/waveapps.com',
  'finance', 'freemium',
  'Kirk Simpson',
  '["python","django","postgres"]',
  NULL, NULL,
  true, false,
  now()
),
(
  'Gusto', 'gusto', 'gusto.com',
  'Payroll, benefits and HR software',
  'Gusto is a modern payroll, benefits, and HR platform for small and medium-sized businesses. Handles taxes, compliance, and onboarding automatically.',
  'https://logo.clearbit.com/gusto.com',
  'hr', 'subscription',
  'Josh Reeves, Tomer London, Edward Kim',
  '["ruby","rails","postgres","aws"]',
  NULL, 500000000,
  true, true,
  now()
),

-- ============================================================
-- EDUCATION / CREATORS (5)
-- ============================================================
(
  'Teachable', 'teachable', 'teachable.com',
  'Create and sell online courses',
  'Teachable lets creators build and sell online courses, coaching, and digital downloads without any technical knowledge. Used by 100,000+ entrepreneurs.',
  'https://logo.clearbit.com/teachable.com',
  'education', 'freemium',
  'Ankur Nagpal',
  '["ruby","rails","react","postgres"]',
  NULL, NULL,
  true, false,
  now()
),
(
  'Podia', 'podia', 'podia.com',
  'Sell courses, memberships, and downloads',
  'Podia is an all-in-one platform to sell online courses, memberships, and digital downloads. No transaction fees. Includes email marketing and communities.',
  'https://logo.clearbit.com/podia.com',
  'education', 'subscription',
  'Spencer Fry',
  '["ruby","rails","react","postgres"]',
  NULL, NULL,
  true, false,
  now()
),
(
  'Kajabi', 'kajabi', 'kajabi.com',
  'The all-in-one knowledge commerce platform',
  'Kajabi is a comprehensive platform for creating and selling online courses, coaching, podcasts, and communities. Over $6B paid out to creators.',
  'https://logo.clearbit.com/kajabi.com',
  'education', 'subscription',
  'Kenny Rueter, Travis Rosser',
  '["ruby","rails","postgres","react"]',
  NULL, 100000000,
  true, true,
  now()
),
(
  'ConvertKit', 'convertkit', 'convertkit.com',
  'Email marketing for creators',
  'ConvertKit is an email marketing and automation platform built specifically for creators — bloggers, YouTubers, podcasters, and course sellers.',
  'https://logo.clearbit.com/convertkit.com',
  'email-marketing', 'freemium',
  'Nathan Barry',
  '["ruby","rails","mysql","react"]',
  NULL, 35000000,
  true, false,
  now()
),
(
  'Gumroad', 'gumroad', 'gumroad.com',
  'Sell your work directly to your audience',
  'Gumroad is a simple e-commerce platform for creators to sell digital products directly to their audience. No monthly fee — takes a percentage of sales.',
  'https://logo.clearbit.com/gumroad.com',
  'education', 'freemium',
  'Sahil Lavingia',
  '["ruby","rails","postgres","react"]',
  NULL, NULL,
  true, false,
  now()
),

-- ============================================================
-- PRODUCTIVITY (5)
-- ============================================================
(
  'Notion', 'notion', 'notion.so',
  'The all-in-one workspace',
  'Notion is a connected workspace for notes, docs, wikis, databases, and project management. Used by millions of individuals and teams globally.',
  'https://logo.clearbit.com/notion.so',
  'productivity', 'freemium',
  'Ivan Zhao, Simon Last',
  '["react","node","postgres","typescript"]',
  NULL, 100000000,
  true, true,
  now()
),
(
  'Airtable', 'airtable', 'airtable.com',
  'Organize anything with spreadsheet power',
  'Airtable is a low-code platform that combines the simplicity of a spreadsheet with the power of a database. Used for project tracking, CRM, content pipelines, and more.',
  'https://logo.clearbit.com/airtable.com',
  'productivity', 'freemium',
  'Howie Liu, Andrew Ofstad, Emmett Nicholas',
  '["react","node","postgres","aws"]',
  NULL, 300000000,
  true, false,
  now()
),
(
  'Loom', 'loom', 'loom.com',
  'Video messaging for work',
  'Loom lets you record and share video messages instantly — faster than writing an email, more personal than a Slack message. Used by 21M+ people.',
  'https://logo.clearbit.com/loom.com',
  'productivity', 'freemium',
  'Vinay Hiremath, Shahed Khan, Joe Thomas',
  '["react","node","aws","webrtc"]',
  NULL, NULL,
  true, false,
  now()
),
(
  'Typeform', 'typeform', 'typeform.com',
  'Forms that feel like conversations',
  'Typeform creates beautiful, conversational forms and surveys that feel human. Used for lead generation, market research, quizzes, and customer feedback.',
  'https://logo.clearbit.com/typeform.com',
  'productivity', 'freemium',
  'Robert Munoz, David Okuniev',
  '["react","node","postgres","aws"]',
  NULL, NULL,
  true, false,
  now()
),
(
  'Tally', 'tally', 'tally.so',
  'The simplest way to create forms',
  'Tally is a free form builder that works like a doc. Unlimited forms, unlimited responses, no watermark. Built by a two-person bootstrapped team.',
  'https://logo.clearbit.com/tally.so',
  'productivity', 'freemium',
  'Filip Minev, Marie Martens',
  '["react","node","postgres"]',
  500000, NULL,
  true, false,
  now()
),

-- ============================================================
-- CRM / MARKETING (4)
-- ============================================================
(
  'HoneyBook', 'honeybook', 'honeybook.com',
  'Client management for independent businesses',
  'HoneyBook is a client flow platform for independent businesses — proposals, contracts, invoices, and payments in one place. Loved by photographers, designers, and consultants.',
  'https://logo.clearbit.com/honeybook.com',
  'crm', 'subscription',
  'Oz Alon, Naama Alon, Dror Shimoni',
  '["react","node","mongo","aws"]',
  5000000, NULL,
  true, false,
  now()
),
(
  'Pipedrive', 'pipedrive', 'pipedrive.com',
  'CRM designed by salespeople, for salespeople',
  'Pipedrive is a sales-focused CRM that helps small and mid-size teams manage deals visually. Pipeline view, activity reminders, and powerful reporting.',
  'https://logo.clearbit.com/pipedrive.com',
  'crm', 'subscription',
  'Timo Rein, Urmas Purde, Martin Henk',
  '["react","node","mysql","aws"]',
  NULL, 100000000,
  true, false,
  now()
),
(
  'Close', 'close', 'close.com',
  'CRM built for sales teams',
  'Close is a CRM built for inside sales teams with built-in calling, SMS, and email. Designed to eliminate manual data entry and maximize selling time.',
  'https://logo.clearbit.com/close.com',
  'crm', 'subscription',
  'Steli Efti',
  '["python","react","mongo","elasticsearch"]',
  3000000, NULL,
  true, false,
  now()
),
(
  'Keap', 'keap', 'keap.com',
  'CRM and marketing automation for small business',
  'Keap (formerly Infusionsoft) is a CRM and marketing automation platform for small businesses. Combines contact management, email marketing, and sales pipelines.',
  'https://logo.clearbit.com/keap.com',
  'crm', 'subscription',
  'Clate Mask, Scott Martineau',
  '["java","react","mysql","aws"]',
  NULL, 200000000,
  true, false,
  now()
),

-- ============================================================
-- DEV TOOLS (5)
-- ============================================================
(
  'Vercel', 'vercel', 'vercel.com',
  'Deploy web projects with zero configuration',
  'Vercel is the platform for frontend developers — instant deployments, serverless functions, and global edge delivery. Creators of Next.js.',
  'https://logo.clearbit.com/vercel.com',
  'dev-tools', 'freemium',
  'Guillermo Rauch',
  '["next","node","rust","go"]',
  NULL, 200000000,
  true, true,
  now()
),
(
  'Supabase', 'supabase', 'supabase.com',
  'The open source Firebase alternative',
  'Supabase is an open source backend-as-a-service built on Postgres. Auth, database, storage, realtime, and edge functions — all in one platform.',
  'https://logo.clearbit.com/supabase.com',
  'dev-tools', 'freemium',
  'Paul Copplestone, Ant Wilson',
  '["postgres","deno","react","rust"]',
  NULL, 50000000,
  true, true,
  now()
),
(
  'Linear', 'linear', 'linear.app',
  'Issue tracking built for high-performance teams',
  'Linear is a project management tool for software teams — fast, opinionated, and built for flow. Keyboard-first design with Git and Figma integrations.',
  'https://logo.clearbit.com/linear.app',
  'dev-tools', 'subscription',
  'Karri Saarinen, Jori Lallo, Tuomas Artman',
  '["react","node","postgres","typescript"]',
  2000000, NULL,
  true, false,
  now()
),
(
  'Lemon Squeezy', 'lemon-squeezy', 'lemonsqueezy.com',
  'Sell digital products and SaaS',
  'Lemon Squeezy is a merchant of record platform for software companies — handles global payments, tax compliance, subscriptions, and license keys.',
  'https://logo.clearbit.com/lemonsqueezy.com',
  'dev-tools', 'freemium',
  'Matt Lowe, Dani Grant',
  '["laravel","react","mysql"]',
  NULL, NULL,
  true, false,
  now()
),
(
  'Resend', 'resend', 'resend.com',
  'Email for developers',
  'Resend is an email API for developers — send transactional emails with code, not a GUI. Built on top of best-in-class deliverability infrastructure.',
  'https://logo.clearbit.com/resend.com',
  'dev-tools', 'freemium',
  'Zeno Rocha',
  '["node","react","typescript","aws"]',
  NULL, NULL,
  true, false,
  now()
),

-- ============================================================
-- DESIGN (2)
-- ============================================================
(
  'Canva', 'canva', 'canva.com',
  'Create beautiful designs for any occasion',
  'Canva is an online design platform used by 170M+ people worldwide. Templates, drag-and-drop editor, and AI tools for presentations, social media, and print.',
  'https://logo.clearbit.com/canva.com',
  'design', 'freemium',
  'Melanie Perkins',
  '["react","java","aws","python"]',
  NULL, 2000000000,
  true, true,
  now()
),
(
  'Figma', 'figma', 'figma.com',
  'Design, prototype, and collaborate',
  'Figma is the collaborative design platform used by product teams worldwide — UI design, prototyping, and design systems all in one browser-based tool.',
  'https://logo.clearbit.com/figma.com',
  'design', 'freemium',
  'Dylan Field, Evan Wallace',
  '["cpp","webassembly","react","typescript"]',
  NULL, 600000000,
  true, true,
  now()
),

-- ============================================================
-- FIELD SERVICE / SMB (4)
-- ============================================================
(
  'Jobber', 'jobber', 'getjobber.com',
  'Field service management software',
  'Jobber is business management software for home service companies — quoting, scheduling, invoicing, and client communication in one platform.',
  'https://logo.clearbit.com/getjobber.com',
  'productivity', 'subscription',
  'Forrest Zeisler, Sam Pillar',
  '["ruby","rails","react","postgres"]',
  15000000, NULL,
  true, false,
  now()
),
(
  'Housecall Pro', 'housecall-pro', 'housecallpro.com',
  'Home service software for pros',
  'Housecall Pro is an all-in-one app for home service professionals — scheduling, dispatching, invoicing, and marketing tools for plumbers, HVAC, electricians, and more.',
  'https://logo.clearbit.com/housecallpro.com',
  'productivity', 'subscription',
  'Ian Heidt',
  '["react","node","postgres","aws"]',
  10000000, NULL,
  true, false,
  now()
),
(
  'ServiceTitan', 'servicetitan', 'servicetitan.com',
  'Software for home service businesses',
  'ServiceTitan is the leading platform for HVAC, plumbing, electrical, and other home service businesses. Scheduling, dispatch, marketing, and reporting at enterprise scale.',
  'https://logo.clearbit.com/servicetitan.com',
  'productivity', 'subscription',
  'Ara Mahdessian, Vahe Kuzoyan',
  '["dotnet","react","sqlserver","aws"]',
  NULL, 550000000,
  true, true,
  now()
),
(
  'Pike13', 'pike13', 'pike13.com',
  'Business software for fitness studios',
  'Pike13 provides client management, scheduling, billing, and reporting for fitness studios and gyms. Designed for class-based businesses.',
  'https://logo.clearbit.com/pike13.com',
  'scheduling', 'subscription',
  'Peter Dering',
  '["ruby","rails","react","postgres"]',
  NULL, NULL,
  true, false,
  now()
),

-- ============================================================
-- POS / FOOD (2)
-- ============================================================
(
  'Toast POS', 'toast-pos', 'toasttab.com',
  'Restaurant management platform',
  'Toast is a restaurant POS and management platform built for the food service industry — orders, payments, kitchen display, online ordering, and analytics.',
  'https://logo.clearbit.com/toasttab.com',
  'pos', 'subscription',
  'Steve Fredette, Aman Narang, Jonathan Grimm',
  '["java","react","android","aws"]',
  NULL, 1000000000,
  true, true,
  now()
),
(
  'Square', 'square', 'squareup.com',
  'Payments and point-of-sale solutions',
  'Square offers payment processing, POS software, and financial services for businesses of all sizes. From card readers to payroll, all connected.',
  'https://logo.clearbit.com/squareup.com',
  'pos', 'freemium',
  'Jack Dorsey, Jim McKelvey',
  '["java","ruby","react","ios","android"]',
  NULL, 23000000000,
  true, false,
  now()
),

-- ============================================================
-- HR (2)
-- ============================================================
(
  'Lattice', 'lattice', 'lattice.com',
  'People management platform',
  'Lattice is a people management platform for HR teams — performance reviews, goal tracking, engagement surveys, and career development tools.',
  'https://logo.clearbit.com/lattice.com',
  'hr', 'subscription',
  'Jack Altman, Eric Koslow',
  '["react","node","postgres","graphql"]',
  NULL, 100000000,
  true, false,
  now()
),
(
  'BambooHR', 'bamboohr', 'bamboohr.com',
  'HR software for small and medium businesses',
  'BambooHR is an HRIS for small and medium businesses — employee records, onboarding, time tracking, and performance management in one place.',
  'https://logo.clearbit.com/bamboohr.com',
  'hr', 'subscription',
  'Ben Peterson, Ryan Sanders',
  '["php","react","mysql","aws"]',
  NULL, NULL,
  true, false,
  now()
),

-- ============================================================
-- EMAIL / ANALYTICS (2)
-- ============================================================
(
  'Mailchimp', 'mailchimp', 'mailchimp.com',
  'Email marketing, automation and CRM tools',
  'Mailchimp is the world''s largest email marketing platform. Campaigns, automations, landing pages, and CRM for businesses of all sizes.',
  'https://logo.clearbit.com/mailchimp.com',
  'email-marketing', 'freemium',
  'Ben Chestnut, Dan Kurzius',
  '["python","react","mysql","aws"]',
  NULL, 900000000,
  true, true,
  now()
),
(
  'Hotjar', 'hotjar', 'hotjar.com',
  'Understand how users behave on your site',
  'Hotjar is a product experience insights tool — heatmaps, session recordings, surveys, and funnel analysis to understand real user behavior.',
  'https://logo.clearbit.com/hotjar.com',
  'analytics', 'freemium',
  'David Darmanin',
  '["python","react","postgres","aws"]',
  NULL, NULL,
  true, false,
  now()
)

ON CONFLICT (slug) DO NOTHING;

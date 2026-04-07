-- ============================================================
-- products_system migration
-- Tables: products, user_purchases, content_blocs,
--         content_bricks, user_progress
-- ============================================================

-- ── products (catalogue statique, lecture publique) ──────────
CREATE TABLE products (
  slug            TEXT PRIMARY KEY,
  name            TEXT        NOT NULL,
  description     TEXT,
  price_cents     INT         NOT NULL,
  stripe_price_id TEXT,
  category        TEXT        NOT NULL, -- 'construire','claude','agents','coaching'
  icon            TEXT,                 -- nom icone Lucide
  sort_order      INT         DEFAULT 0,
  is_active       BOOLEAN     DEFAULT true
);
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read" ON products FOR SELECT USING (true);

-- seed catalogue
INSERT INTO products (slug, name, description, price_cents, stripe_price_id, category, icon, sort_order, is_active) VALUES
  ('blueprint',       'Buildrs Blueprint',         'Le parcours complet.',        2700,  NULL, 'construire', 'book-open',   1, true),
  ('claude-buildrs',  'Démarrer avec Claude',       '7 blocs, 43 briques.',        4700,  NULL, 'claude',     'sparkles',    2, true),
  ('claude-code',     'Claude Code by Buildrs',     '8 blocs, 49 briques.',        3700,  NULL, 'claude',     'terminal',    3, true),
  ('claude-cowork',   'Claude Cowork by Buildrs',   '6 blocs, 47 briques.',        3700,  NULL, 'claude',     'refresh-cw',  4, true),
  ('agents-ia',       'Pack Agents IA',             '5 agents spécialisés.',      19700,  NULL, 'agents',     'bot',         5, true),
  ('sprint',          'Sprint Buildrs',             'MVP en 4 semaines.',         49700,  NULL, 'coaching',   'rocket',      6, true),
  ('cohorte',         'Cohorte Buildrs',            '12 semaines.',              149700,  NULL, 'coaching',   'users',       7, true);

-- ── user_purchases ────────────────────────────────────────────
CREATE TABLE user_purchases (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID        REFERENCES auth.users(id) ON DELETE CASCADE,
  product_slug      TEXT        REFERENCES products(slug),
  purchased_at      TIMESTAMPTZ DEFAULT now(),
  stripe_payment_id TEXT,
  amount_paid_cents INT,
  UNIQUE(user_id, product_slug)
);
ALTER TABLE user_purchases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user reads own"   ON user_purchases FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "service inserts"  ON user_purchases FOR INSERT WITH CHECK (true);

-- ── content_blocs ─────────────────────────────────────────────
CREATE TABLE content_blocs (
  id           TEXT PRIMARY KEY,          -- ex: 'claude-buildrs-1'
  product_slug TEXT REFERENCES products(slug),
  title        TEXT        NOT NULL,
  description  TEXT,
  sort_order   INT         DEFAULT 0,
  total_bricks INT         DEFAULT 0
);
ALTER TABLE content_blocs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read" ON content_blocs FOR SELECT USING (true);

-- ── content_bricks ────────────────────────────────────────────
CREATE TABLE content_bricks (
  id             TEXT PRIMARY KEY,        -- ex: 'claude-buildrs-1-1'
  bloc_id        TEXT REFERENCES content_blocs(id),
  title          TEXT        NOT NULL,
  content_md     TEXT        DEFAULT '',
  template_code  TEXT,
  external_links JSONB,
  sort_order     INT         DEFAULT 0
);
ALTER TABLE content_bricks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read" ON content_bricks FOR SELECT USING (true);

-- ── user_progress (brick completion) ─────────────────────────
CREATE TABLE user_progress (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        REFERENCES auth.users(id) ON DELETE CASCADE,
  brick_id     TEXT        REFERENCES content_bricks(id),
  completed    BOOLEAN     DEFAULT false,
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, brick_id)
);
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user reads own"   ON user_progress FOR SELECT  USING (auth.uid() = user_id);
CREATE POLICY "user writes own"  ON user_progress FOR INSERT  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user updates own" ON user_progress FOR UPDATE  USING (auth.uid() = user_id);

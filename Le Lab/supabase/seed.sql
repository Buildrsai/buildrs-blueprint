-- Seed de développement — NE PAS utiliser en production
-- À appliquer manuellement via : supabase db reset (réinitialise + applique seed)

-- Note : le trigger handle_new_user crée le profil automatiquement
-- quand on crée un user via l'API Auth. Ce seed ne peut pas créer
-- de user directement dans auth.users sans passer par l'API.
-- Utiliser le dashboard Supabase → Authentication → Add user pour créer
-- un user de test, puis observer le profil créé automatiquement.

select 'Seed prêt — crée un user de test via le dashboard Supabase Auth' as message;

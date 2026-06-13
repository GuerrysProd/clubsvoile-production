-- Nettoyage : suppression des clubs hors-voile (plongée, ski nautique,
-- wakeboard, jet ski, aviron, football) qui ne mentionnent pas "voile" et ne
-- proposent pas d'activités voile (Wing Foil, Catamaran, Dériveur, etc.).
-- "Nautic Sport Carnac" et "Swell Kite Hyères" sont volontairement conservés
-- car ils proposent aussi des activités voile.

DELETE FROM clubs WHERE id IN (
  'c972d521-b1d0-47f8-b418-c87444c5a254', -- Plongée Aigle Nautique (Nice)
  'cddd0878-6bd3-4ec5-85c4-6e43629e8145', -- Water Free Gliss (Ski nautique/Wakeboard) - Saint-Laurent-du-Var
  '29345a49-1acc-4311-b6bf-a4fc32c81480', -- Société Nautique Baie de Saint-Malo - Aviron de mer
  '438fceb3-9431-4062-8454-29ec0f4400f0', -- Aviron de Mer: Yole Club Brest Iroise
  '6ac55d7e-cec6-4f3d-9251-21d2b89865a3', -- La Société Havraise de l'Aviron
  '6e8ef93d-5e97-415d-be00-1ed357930922', -- CS Andelys Football
  'cb5045fa-3fb7-41fa-931a-c28bccffac65', -- Planete Racing - Jet Ski Vendée AquaPark
  '6ff2ce5b-3bf2-4b62-9d84-d879d3464ceb', -- Aviron Club Soustonnais
  '0feb3fdb-b65b-4a5c-8752-5810b9a56171', -- Club D'Aviron Saintais
  '0ee09d8c-b961-49be-9075-aa834855af48', -- Aviron Ur Joko
  'c68ffc28-6985-4665-aa00-e61f6b1530d3', -- PARAL'aile - Jet ski et bouée tractée
  'e15eb0bc-eb35-46ea-9908-9ccef2dd9052', -- Bouée tractée & Ski nautique Orthez
  '94f60e76-0d13-41a0-88e0-e947b807a576', -- ILEO PLONGEE PORQUEROLLES
  '71af9c31-a1c6-49c0-b257-83127dbc1e4b', -- Saint Aygulf Plongée
  'da42d022-dc36-4c69-bb96-476e9e83c71a', -- Belles Rives Ski Nautique Club
  '9d54c082-8a74-4fbc-b0dc-a964517f482a', -- Théoule Island (Wakeboard/Ski/Paddle)
  '47debe52-2907-4098-be25-0caaa29a6ace', -- Base Nautique Aviron Saint Cassien
  '4e484a36-1482-48a2-8c23-a66f8ef54d88', -- Wakeboard Almanarre
  '2c22eada-0adf-47df-8e68-0f326f858bc6', -- Kitesurfing School Wakeboard Paddle Ventileau
  'db029f42-b6f6-4856-874f-f41660bce559', -- Centre de Plongée Algajola
  '2d93ea12-ac11-43e8-ada3-3316058d6b43', -- JAM Plongée Montreuil
  'd3787531-d484-4714-ac7b-f90ce9bc7d94', -- Club d'aviron Amiens
  'f6ef307d-4e93-4828-96f9-824c5ddf8d1f', -- Aviron Brest Iroise
  'afbe76e9-6197-4c57-a759-dfe6d5d2d79b', -- Jarnac Sports Football
  '14588520-8fc9-4b1e-ad89-4c2d95b2d4a0', -- Club ski nautique Cognac
  '6a5525ab-b07b-4982-8d02-5ab5a2653b56', -- Porto Plongee
  'b360c8e6-7892-4f5b-88a3-8eed63a71b24', -- RSCM plongée Montreuil
  '80e91dad-f3f3-40bb-9819-cfb3f1c6d9f0'  -- Bleu Marine Plongée Porto Ota
);

-- Update menu_items.image_url with per-dish photo paths
-- After you generate photos into /public/menu/photos, run this in Supabase.

-- Desserts
UPDATE menu_items SET image_url = '/menu/photos/fruit-salad-with-ice-cream.jpg' WHERE name = 'Fruit salad with ice cream';
UPDATE menu_items SET image_url = '/menu/photos/cake-with-ice-cream.jpg' WHERE name = 'Cake with ice cream';
UPDATE menu_items SET image_url = '/menu/photos/watalappan.jpg' WHERE name = 'Watalappan';
UPDATE menu_items SET image_url = '/menu/photos/gulab-jamun-2pcs.jpg' WHERE name = 'Gulab jamun (2 pcs)';
UPDATE menu_items SET image_url = '/menu/photos/kesari.jpg' WHERE name = 'Kesari';

-- Tea & Drinks
UPDATE menu_items SET image_url = '/menu/photos/normal-tea.jpg' WHERE name = 'Normal tea';
UPDATE menu_items SET image_url = '/menu/photos/special-tea.jpg' WHERE name = 'Special tea';
UPDATE menu_items SET image_url = '/menu/photos/nescafe.jpg' WHERE name = 'Nescafe';
UPDATE menu_items SET image_url = '/menu/photos/milk-tea.jpg' WHERE name = 'Milk tea';
UPDATE menu_items SET image_url = '/menu/photos/choco-milk-shake.jpg' WHERE name = 'Choco milk shake';
UPDATE menu_items SET image_url = '/menu/photos/vanilla-milk-shake.jpg' WHERE name = 'Vanilla milk shake';

-- Lunch Packs
UPDATE menu_items SET image_url = '/menu/photos/lunch-veg-normal.jpg' WHERE name = 'Lunch Veg (Normal)';
UPDATE menu_items SET image_url = '/menu/photos/lunch-egg-normal.jpg' WHERE name = 'Lunch Egg (Normal)';
UPDATE menu_items SET image_url = '/menu/photos/lunch-fish-normal.jpg' WHERE name = 'Lunch Fish (Normal)';
UPDATE menu_items SET image_url = '/menu/photos/lunch-chicken-normal.jpg' WHERE name = 'Lunch Chicken (Normal)';
UPDATE menu_items SET image_url = '/menu/photos/white-rice-with-cutlet.jpg' WHERE name = 'White rice with cutlet';

UPDATE menu_items SET image_url = '/menu/photos/lunch-veg-premium.jpg' WHERE name = 'Lunch Veg (Premium)';
UPDATE menu_items SET image_url = '/menu/photos/lunch-egg-premium.jpg' WHERE name = 'Lunch Egg (Premium)';
UPDATE menu_items SET image_url = '/menu/photos/lunch-fish-premium.jpg' WHERE name = 'Lunch Fish (Premium)';
UPDATE menu_items SET image_url = '/menu/photos/lunch-chicken-premium.jpg' WHERE name = 'Lunch Chicken (Premium)';

-- Fried Rice
UPDATE menu_items SET image_url = '/menu/photos/fried-rice-veg-normal.jpg' WHERE name = 'Fried rice Veg (Normal)';
UPDATE menu_items SET image_url = '/menu/photos/fried-rice-egg-normal.jpg' WHERE name = 'Fried rice Egg (Normal)';
UPDATE menu_items SET image_url = '/menu/photos/fried-rice-chicken-normal.jpg' WHERE name = 'Fried rice Chicken (Normal)';
UPDATE menu_items SET image_url = '/menu/photos/fried-rice-beef-normal.jpg' WHERE name = 'Fried rice Beef (Normal)';
UPDATE menu_items SET image_url = '/menu/photos/fried-rice-seafood-normal.jpg' WHERE name = 'Fried rice Seafood (Normal)';
UPDATE menu_items SET image_url = '/menu/photos/fried-rice-mutton-normal.jpg' WHERE name = 'Fried rice Mutton (Normal)';
UPDATE menu_items SET image_url = '/menu/photos/fried-rice-mix-normal.jpg' WHERE name = 'Fried rice Mix (Normal)';

UPDATE menu_items SET image_url = '/menu/photos/fried-rice-veg-full.jpg' WHERE name = 'Fried rice Veg (Full)';
UPDATE menu_items SET image_url = '/menu/photos/fried-rice-egg-full.jpg' WHERE name = 'Fried rice Egg (Full)';
UPDATE menu_items SET image_url = '/menu/photos/fried-rice-chicken-full.jpg' WHERE name = 'Fried rice Chicken (Full)';
UPDATE menu_items SET image_url = '/menu/photos/fried-rice-beef-full.jpg' WHERE name = 'Fried rice Beef (Full)';
UPDATE menu_items SET image_url = '/menu/photos/fried-rice-seafood-full.jpg' WHERE name = 'Fried rice Seafood (Full)';
UPDATE menu_items SET image_url = '/menu/photos/fried-rice-mutton-full.jpg' WHERE name = 'Fried rice Mutton (Full)';
UPDATE menu_items SET image_url = '/menu/photos/fried-rice-mix-full.jpg' WHERE name = 'Fried rice Mix (Full)';

-- Koththu Rotti
UPDATE menu_items SET image_url = '/menu/photos/koththu-veg-normal.jpg' WHERE name = 'Koththu Veg (Normal)';
UPDATE menu_items SET image_url = '/menu/photos/koththu-egg-normal.jpg' WHERE name = 'Koththu Egg (Normal)';
UPDATE menu_items SET image_url = '/menu/photos/koththu-chicken-normal.jpg' WHERE name = 'Koththu Chicken (Normal)';
UPDATE menu_items SET image_url = '/menu/photos/koththu-beef-normal.jpg' WHERE name = 'Koththu Beef (Normal)';
UPDATE menu_items SET image_url = '/menu/photos/koththu-seafood-normal.jpg' WHERE name = 'Koththu Seafood (Normal)';
UPDATE menu_items SET image_url = '/menu/photos/koththu-mutton-normal.jpg' WHERE name = 'Koththu Mutton (Normal)';
UPDATE menu_items SET image_url = '/menu/photos/koththu-mix-normal.jpg' WHERE name = 'Koththu Mix (Normal)';

UPDATE menu_items SET image_url = '/menu/photos/koththu-veg-full.jpg' WHERE name = 'Koththu Veg (Full)';
UPDATE menu_items SET image_url = '/menu/photos/koththu-egg-full.jpg' WHERE name = 'Koththu Egg (Full)';
UPDATE menu_items SET image_url = '/menu/photos/koththu-chicken-full.jpg' WHERE name = 'Koththu Chicken (Full)';
UPDATE menu_items SET image_url = '/menu/photos/koththu-beef-full.jpg' WHERE name = 'Koththu Beef (Full)';
UPDATE menu_items SET image_url = '/menu/photos/koththu-seafood-full.jpg' WHERE name = 'Koththu Seafood (Full)';
UPDATE menu_items SET image_url = '/menu/photos/koththu-mutton-full.jpg' WHERE name = 'Koththu Mutton (Full)';
UPDATE menu_items SET image_url = '/menu/photos/koththu-mix-full.jpg' WHERE name = 'Koththu Mix (Full)';

-- Biryani
UPDATE menu_items SET image_url = '/menu/photos/veg-biryani-normal.jpg' WHERE name = 'Veg Biryani (Normal)';
UPDATE menu_items SET image_url = '/menu/photos/egg-biryani-normal.jpg' WHERE name = 'Egg Biryani (Normal)';
UPDATE menu_items SET image_url = '/menu/photos/paneer-biryani-normal.jpg' WHERE name = 'Paneer Biryani (Normal)';
UPDATE menu_items SET image_url = '/menu/photos/chicken-biryani-normal.jpg' WHERE name = 'Chicken Biryani (Normal)';
UPDATE menu_items SET image_url = '/menu/photos/beef-biryani-normal.jpg' WHERE name = 'Beef Biryani (Normal)';
UPDATE menu_items SET image_url = '/menu/photos/mutton-biryani-normal.jpg' WHERE name = 'Mutton Biryani (Normal)';
UPDATE menu_items SET image_url = '/menu/photos/seafood-biryani-normal.jpg' WHERE name = 'Seafood Biryani (Normal)';

UPDATE menu_items SET image_url = '/menu/photos/veg-bucket-biryani-3p.jpg' WHERE name = 'Veg Bucket Biryani (3P)';
UPDATE menu_items SET image_url = '/menu/photos/egg-bucket-biryani-3p.jpg' WHERE name = 'Egg Bucket Biryani (3P)';
UPDATE menu_items SET image_url = '/menu/photos/paneer-bucket-biryani-3p.jpg' WHERE name = 'Paneer Bucket Biryani (3P)';
UPDATE menu_items SET image_url = '/menu/photos/chicken-bucket-biryani-3p.jpg' WHERE name = 'Chicken Bucket Biryani (3P)';
UPDATE menu_items SET image_url = '/menu/photos/beef-bucket-biryani-3p.jpg' WHERE name = 'Beef Bucket Biryani (3P)';
UPDATE menu_items SET image_url = '/menu/photos/mutton-bucket-biryani-3p.jpg' WHERE name = 'Mutton Bucket Biryani (3P)';
UPDATE menu_items SET image_url = '/menu/photos/seafood-bucket-biryani-3p.jpg' WHERE name = 'Seafood Bucket Biryani (3P)';

UPDATE menu_items SET image_url = '/menu/photos/veg-bucket-biryani-5p.jpg' WHERE name = 'Veg Bucket Biryani (5P)';
UPDATE menu_items SET image_url = '/menu/photos/egg-bucket-biryani-5p.jpg' WHERE name = 'Egg Bucket Biryani (5P)';
UPDATE menu_items SET image_url = '/menu/photos/paneer-bucket-biryani-5p.jpg' WHERE name = 'Paneer Bucket Biryani (5P)';
UPDATE menu_items SET image_url = '/menu/photos/chicken-bucket-biryani-5p.jpg' WHERE name = 'Chicken Bucket Biryani (5P)';
UPDATE menu_items SET image_url = '/menu/photos/beef-bucket-biryani-5p.jpg' WHERE name = 'Beef Bucket Biryani (5P)';
UPDATE menu_items SET image_url = '/menu/photos/mutton-bucket-biryani-5p.jpg' WHERE name = 'Mutton Bucket Biryani (5P)';
UPDATE menu_items SET image_url = '/menu/photos/seafood-bucket-biryani-5p.jpg' WHERE name = 'Seafood Bucket Biryani (5P)';

-- Nasi Goreng & Noodles
UPDATE menu_items SET image_url = '/menu/photos/paneer-nasi-goreng.jpg' WHERE name = 'Paneer Nasi Goreng';
UPDATE menu_items SET image_url = '/menu/photos/chicken-nasi-goreng.jpg' WHERE name = 'Chicken Nasi Goreng';
UPDATE menu_items SET image_url = '/menu/photos/beef-nasi-goreng.jpg' WHERE name = 'Beef Nasi Goreng';
UPDATE menu_items SET image_url = '/menu/photos/seafood-nasi-goreng.jpg' WHERE name = 'Seafood Nasi Goreng';
UPDATE menu_items SET image_url = '/menu/photos/mix-nasi-goreng.jpg' WHERE name = 'Mix Nasi Goreng';
UPDATE menu_items SET image_url = '/menu/photos/mutton-nasi-goreng.jpg' WHERE name = 'Mutton Nasi Goreng';

UPDATE menu_items SET image_url = '/menu/photos/veg-noodles.jpg' WHERE name = 'Veg Noodles';
UPDATE menu_items SET image_url = '/menu/photos/egg-noodles.jpg' WHERE name = 'Egg Noodles';
UPDATE menu_items SET image_url = '/menu/photos/chicken-noodles.jpg' WHERE name = 'Chicken Noodles';
UPDATE menu_items SET image_url = '/menu/photos/beef-noodles.jpg' WHERE name = 'Beef Noodles';
UPDATE menu_items SET image_url = '/menu/photos/seafood-noodles.jpg' WHERE name = 'Seafood Noodles';
UPDATE menu_items SET image_url = '/menu/photos/mix-noodles.jpg' WHERE name = 'Mix Noodles';
UPDATE menu_items SET image_url = '/menu/photos/mutton-noodles.jpg' WHERE name = 'Mutton Noodles';

-- Curries, Omelets, Starters, Soups
UPDATE menu_items SET image_url = '/menu/photos/potato-curry.jpg' WHERE name = 'Potato curry';
UPDATE menu_items SET image_url = '/menu/photos/paneer-masala.jpg' WHERE name = 'Paneer masala';
UPDATE menu_items SET image_url = '/menu/photos/chicken-curry.jpg' WHERE name = 'Chicken curry';
UPDATE menu_items SET image_url = '/menu/photos/beef-curry.jpg' WHERE name = 'Beef curry';
UPDATE menu_items SET image_url = '/menu/photos/mutton-curry.jpg' WHERE name = 'Mutton curry';
UPDATE menu_items SET image_url = '/menu/photos/egg-curry.jpg' WHERE name = 'Egg curry';

UPDATE menu_items SET image_url = '/menu/photos/plain-omelet.jpg' WHERE name = 'Plain omelet';
UPDATE menu_items SET image_url = '/menu/photos/sri-lankan-omelet.jpg' WHERE name = 'Sri Lankan omelet';
UPDATE menu_items SET image_url = '/menu/photos/special-omelet.jpg' WHERE name = 'Special omelet';

UPDATE menu_items SET image_url = '/menu/photos/chicken-65.jpg' WHERE name = 'Chicken 65';
UPDATE menu_items SET image_url = '/menu/photos/french-fries.jpg' WHERE name = 'French fries';
UPDATE menu_items SET image_url = '/menu/photos/onion-pakoda.jpg' WHERE name = 'Onion pakoda';

UPDATE menu_items SET image_url = '/menu/photos/veg-soup.jpg' WHERE name = 'Veg soup';
UPDATE menu_items SET image_url = '/menu/photos/chicken-soup.jpg' WHERE name = 'Chicken soup';
UPDATE menu_items SET image_url = '/menu/photos/mutton-soup.jpg' WHERE name = 'Mutton soup';



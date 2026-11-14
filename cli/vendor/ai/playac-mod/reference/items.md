# Items for shops.json

Generated from https://playaconline.com/schemas/items.json. Do not edit by hand.

831 goods can be stocked at the flower shop (shops.json "target": "flower") and 1996 at Nook's (target "nook", api 2), out of 2333 items and pieces of furniture. Use the id as a string in shops.json: `{ "item": "0x2800", "price": 600 }`. "price" is the usual shop price (leave "price" out to use it); a lower price is raised to the floor for that shop.

- price: Bells at the shop for the town's own fruit; a foreign fruit sells for 2000. The grab bag costs the current year and is shown as 0.
- buyback: what Nook pays (price / 4).
- floor: the lowest price each shop sells it at. A shops.json price below it is raised to it. It is the buyback, except a town fruit (apple, cherry, pear, peach, orange) at the flower shop, which is 500: what any Nook pays for a fruit from another town.
- stockable: whether a shops.json good of this id stays on the shelf, per target. refusal says why not; the game leaves such a good out and says so on the mod's row in the Mods tab.
- The flower shop puts goods on a shelf, so it needs a good with a shop shelf model: fruit, saplings, seed bags, tools and the like. No vanilla furniture has one. A mod's OWN items (content.items, furniture on a vanilla base) are always stockable there: they stand on the bench as furniture.
- Nook's shop sells vanilla furniture, umbrellas, paint and diaries without a shelf model; every other good needs one, and a good needs a spot on Nook's shelves.
- name: furniture names are the game's English names. A shirt, fish, bug, umbrella or tool takes the English name of its furniture form. Other items have only a number in the game's tables and are named by kind and number (stationery 7, carpet 12, wallpaper 3, music 5); a few keep a short internal label.
- Furniture is listed once, by its south-facing id (the next three ids are the other facings).

| id | name | kind | price | flower shop (floor) | Nook's (floor) |
|---|---|---|---|---|---|
| `0x1000` | spooky wardrobe | furniture | 41240 | no | yes (10310) |
| `0x1004` | classic wardrobe | furniture | 2560 | no | yes (640) |
| `0x1008` | blue wardrobe | furniture | 1920 | no | yes (480) |
| `0x100C` | office locker | furniture | 1200 | no | yes (300) |
| `0x1010` | Jingle wardrobe | furniture | 48960 | no | yes (12240) |
| `0x1014` | regal armoire | furniture | 3820 | no | yes (955) |
| `0x1018` | cabana wardrobe | furniture | 2240 | no | yes (560) |
| `0x101C` | cabin wardrobe | furniture | 2480 | no | yes (620) |
| `0x1020` | lovely armoire | furniture | 2240 | no | yes (560) |
| `0x1024` | green wardrobe | furniture | 2300 | no | yes (575) |
| `0x1028` | pear wardrobe | furniture | 1400 | no | yes (350) |
| `0x102C` | ranch wardrobe | furniture | 3050 | no | yes (762) |
| `0x1030` | blue cabinet | furniture | 2400 | no | yes (600) |
| `0x1034` | modern wardrobe | furniture | 2560 | no | yes (640) |
| `0x1038` | exotic wardrobe | furniture | 2180 | no | yes (545) |
| `0x103C` | Jingle dresser | furniture | 48960 | no | yes (12240) |
| `0x1040` | regal dresser | furniture | 3520 | no | yes (880) |
| `0x1044` | cabana dresser | furniture | 2400 | no | yes (600) |
| `0x1048` | cabin dresser | furniture | 2160 | no | yes (540) |
| `0x104C` | lovely dresser | furniture | 2160 | no | yes (540) |
| `0x1050` | spooky dresser | furniture | 41240 | no | yes (10310) |
| `0x1054` | green dresser | furniture | 2320 | no | yes (580) |
| `0x1058` | pear dresser | furniture | 1600 | no | yes (400) |
| `0x105C` | ranch dresser | furniture | 2720 | no | yes (680) |
| `0x1060` | classic vanity | furniture | 2560 | no | yes (640) |
| `0x1064` | blue bureau | furniture | 2160 | no | yes (540) |
| `0x1068` | modern dresser | furniture | 2250 | no | yes (562) |
| `0x106C` | exotic bureau | furniture | 2400 | no | yes (600) |
| `0x1070` | kiddie dresser | furniture | 2150 | no | yes (537) |
| `0x1074` | kiddie bureau | furniture | 2200 | no | yes (550) |
| `0x1078` | kiddie wardrobe | furniture | 2180 | no | yes (545) |
| `0x107C` | dresser | furniture | 1300 | no | yes (325) |
| `0x1080` | tansu | furniture | 2250 | no | yes (562) |
| `0x1084` | sewing box | furniture | 1400 | no | yes (350) |
| `0x1088` | fan | furniture | 1200 | no | yes (300) |
| `0x108C` | paper lantern | furniture | 800 | no | yes (200) |
| `0x1090` | tea table | furniture | 1000 | no | yes (250) |
| `0x1094` | shogi board | furniture | 1200 | no | yes (300) |
| `0x1098` | screen | furniture | 1650 | no | yes (412) |
| `0x109C` | zabuton | furniture | 540 | no | yes (135) |
| `0x10A0` | bus stop | furniture | 850 | no | yes (212) |
| `0x10A4` | froggy chair | furniture | 1200 | no | yes (300) |
| `0x10A8` | lily-pad table | furniture | 1600 | no | yes (400) |
| `0x10AC` | refrigerator | furniture | 1200 | no | yes (300) |
| `0x10B0` | chest | furniture | 1400 | no | yes (350) |
| `0x10B4` | rack | furniture | 1400 | no | yes (350) |
| `0x10B8` | red sofa | furniture | 2050 | no | yes (512) |
| `0x10BC` | red armchair | furniture | 1800 | no | yes (450) |
| `0x10C0` | hibachi | furniture | 1200 | no | yes (300) |
| `0x10C4` | stove | furniture | 1980 | no | yes (495) |
| `0x10C8` | cream sofa | furniture | 2000 | no | yes (500) |
| `0x10CC` | tea tansu | furniture | 1600 | no | yes (400) |
| `0x10D0` | pink kotatsu | furniture | 1600 | no | yes (400) |
| `0x10D4` | blue kotatsu | furniture | 1600 | no | yes (400) |
| `0x10D8` | folk guitar | furniture | 1600 | no | yes (400) |
| `0x10DC` | country guitar | furniture | 1700 | no | yes (425) |
| `0x10E0` | rock guitar | furniture | 1800 | no | yes (450) |
| `0x10E4` | hinaningyo | furniture | 2560 | no | yes (640) |
| `0x10E8` | Papa bear | furniture | 2200 | no | yes (550) |
| `0x10EC` | Mama bear | furniture | 1600 | no | yes (400) |
| `0x10F0` | Baby bear | furniture | 800 | no | yes (200) |
| `0x10F4` | classic hutch | furniture | 3360 | no | yes (840) |
| `0x10F8` | classic chair | furniture | 1800 | no | yes (450) |
| `0x10FC` | classic desk | furniture | 2200 | no | yes (550) |
| `0x1100` | classic table | furniture | 1600 | no | yes (400) |
| `0x1104` | classic cabinet | furniture | 2560 | no | yes (640) |
| `0x1108` | rocking chair | furniture | 1400 | no | yes (350) |
| `0x110C` | regal cupboard | furniture | 3360 | no | yes (840) |
| `0x1110` | writing desk | furniture | 1900 | no | yes (475) |
| `0x1114` | Keiko figurine | furniture | 800 | no | yes (200) |
| `0x1118` | Yuki figurine | furniture | 800 | no | yes (200) |
| `0x111C` | Yoko figurine | furniture | 800 | no | yes (200) |
| `0x1120` | Emi figurine | furniture | 800 | no | yes (200) |
| `0x1124` | Maki figurine | furniture | 800 | no | yes (200) |
| `0x1128` | Naomi figurine | furniture | 800 | no | yes (200) |
| `0x112C` | globe | furniture | 1200 | no | yes (300) |
| `0x1130` | regal chair | furniture | 2100 | no | yes (525) |
| `0x1134` | regal table | furniture | 2540 | no | yes (635) |
| `0x1138` | retro TV | furniture | 1600 | no | yes (400) |
| `0x113C` | eagle pole | furniture | 1400 | no | yes (350) |
| `0x1140` | raven pole | furniture | 1400 | no | yes (350) |
| `0x1144` | bear pole | furniture | 1400 | no | yes (350) |
| `0x1148` | frog woman pole | furniture | 1400 | no | yes (350) |
| `0x114C` | taiko drum | furniture | 1300 | no | yes (325) |
| `0x1150` | space heater | furniture | 1700 | no | yes (425) |
| `0x1154` | retro stereo | furniture | 2160 | no | yes (540) |
| `0x1158` | cabana armchair | furniture | 1800 | no | yes (450) |
| `0x115C` | classic sofa | furniture | 2240 | no | yes (560) |
| `0x1160` | lovely end table | furniture | 1800 | no | yes (450) |
| `0x1164` | lovely armchair | furniture | 2000 | no | yes (500) |
| `0x1168` | ivory piano | furniture | 3500 | no | yes (875) |
| `0x116C` | lovely lamp | furniture | 1600 | no | yes (400) |
| `0x1170` | lovely kitchen | furniture | 2280 | no | yes (570) |
| `0x1174` | lovely chair | furniture | 1600 | no | yes (400) |
| `0x1178` | lovely bed | furniture | 2000 | no | yes (500) |
| `0x117C` | classic clock | furniture | 2180 | no | yes (545) |
| `0x1180` | cabana bed | furniture | 2200 | no | yes (550) |
| `0x1184` | green golf bag | furniture | 1600 | no | yes (400) |
| `0x1188` | white golf bag | furniture | 1600 | no | yes (400) |
| `0x118C` | blue golf bag | furniture | 1600 | no | yes (400) |
| `0x1190` | regal bookcase | furniture | 3120 | no | yes (780) |
| `0x1194` | writing chair | furniture | 1000 | no | yes (250) |
| `0x1198` | ranch couch | furniture | 2400 | no | yes (600) |
| `0x119C` | ranch armchair | furniture | 2000 | no | yes (500) |
| `0x11A0` | ranch tea table | furniture | 1800 | no | yes (450) |
| `0x11A4` | ranch hutch | furniture | 2560 | no | yes (640) |
| `0x11A8` | ranch bookcase | furniture | 2000 | no | yes (500) |
| `0x11AC` | ranch chair | furniture | 1400 | no | yes (350) |
| `0x11B0` | ranch bed | furniture | 2300 | no | yes (575) |
| `0x11B4` | ranch table | furniture | 1700 | no | yes (425) |
| `0x11B8` | computer | furniture | 1820 | no | yes (455) |
| `0x11BC` | office desk | furniture | 1600 | no | yes (400) |
| `0x11C0` | Master Sword | furniture | 2800 | no | yes (700) |
| `0x11C4` | N logo | furniture | 2400 | no | yes (600) |
| `0x11C8` | vibraphone | furniture | 1900 | no | yes (475) |
| `0x11CC` | biwa lute | furniture | 1800 | no | yes (450) |
| `0x11D0` | conga drum | furniture | 1600 | no | yes (400) |
| `0x11D4` | extinguisher | furniture | 1300 | no | yes (325) |
| `0x11D8` | ruby econo-chair | furniture | 800 | no | yes (200) |
| `0x11DC` | gold econo-chair | furniture | 800 | no | yes (200) |
| `0x11E0` | jade econo-chair | furniture | 800 | no | yes (200) |
| `0x11E4` | gold stereo | furniture | 2640 | no | yes (660) |
| `0x11E8` | folding chair | furniture | 600 | no | yes (150) |
| `0x11EC` | lovely vanity | furniture | 2200 | no | yes (550) |
| `0x11F0` | birdcage | furniture | 1700 | no | yes (425) |
| `0x11F4` | timpano drum | furniture | 2100 | no | yes (525) |
| `0x11F8` | nice speaker | furniture | 1300 | no | yes (325) |
| `0x11FC` | birthday cake | furniture | 0 | no | yes (0) |
| `0x1200` | school desk | furniture | 1200 | no | yes (300) |
| `0x1204` | graffiti desk | furniture | 1200 | no | yes (300) |
| `0x1208` | towel desk | furniture | 1200 | no | yes (300) |
| `0x120C` | tall cactus | furniture | 1700 | no | yes (425) |
| `0x1210` | round cactus | furniture | 1700 | no | yes (425) |
| `0x1214` | classic bed | furniture | 2520 | no | yes (630) |
| `0x1218` | wide-screen TV | furniture | 2200 | no | yes (550) |
| `0x121C` | lovely table | furniture | 1800 | no | yes (450) |
| `0x1220` | kadomatsu | furniture | 2580 | no | yes (645) |
| `0x1224` | kagamimochi | furniture | 1800 | no | yes (450) |
| `0x1228` | low lantern | furniture | 2100 | no | yes (525) |
| `0x122C` | tall lantern | furniture | 1980 | no | yes (495) |
| `0x1230` | pond lantern | furniture | 1980 | no | yes (495) |
| `0x1234` | office chair | furniture | 1100 | no | yes (275) |
| `0x1238` | cubby hole | furniture | 2200 | no | yes (550) |
| `0x123C` | letter cubby | furniture | 2300 | no | yes (575) |
| `0x1240` | heavy chair | furniture | 1200 | no | yes (300) |
| `0x1244` | school chair | furniture | 800 | no | yes (200) |
| `0x1248` | towel chair | furniture | 1200 | no | yes (300) |
| `0x124C` | science table | furniture | 1900 | no | yes (475) |
| `0x1250` | stepstool | furniture | 1800 | no | yes (450) |
| `0x1254` | shrine lantern | furniture | 1980 | no | yes (495) |
| `0x1258` | barrel | furniture | 800 | no | yes (200) |
| `0x125C` | keg | furniture | 800 | no | yes (200) |
| `0x1260` | vaulting horse | furniture | 1200 | no | yes (300) |
| `0x1264` | glass-top table | furniture | 2200 | no | yes (550) |
| `0x1268` | alarm clock | furniture | 1000 | no | yes (250) |
| `0x126C` | tulip table | furniture | 1900 | no | yes (475) |
| `0x1270` | daffodil table | furniture | 1900 | no | yes (475) |
| `0x1274` | iris table | furniture | 1900 | no | yes (475) |
| `0x1278` | blue vase | furniture | 2500 | no | yes (625) |
| `0x127C` | tulip chair | furniture | 1400 | no | yes (350) |
| `0x1280` | daffodil chair | furniture | 1400 | no | yes (350) |
| `0x1284` | iris chair | furniture | 1400 | no | yes (350) |
| `0x1288` | elephant slide | furniture | 1200 | no | yes (300) |
| `0x128C` | toilet | furniture | 1800 | no | yes (450) |
| `0x1290` | super toilet | furniture | 1980 | no | yes (495) |
| `0x1294` | pine table | furniture | 2280 | no | yes (570) |
| `0x1298` | pine chair | furniture | 1800 | no | yes (450) |
| `0x129C` | tea vase | furniture | 2400 | no | yes (600) |
| `0x12A0` | red vase | furniture | 2450 | no | yes (612) |
| `0x12A4` | sewing machine | furniture | 1350 | no | yes (337) |
| `0x12A8` | billiard table | furniture | 1800 | no | yes (450) |
| `0x12AC` | famous painting | furniture | 1960 | no | yes (490) |
| `0x12B0` | basic painting | furniture | 1960 | no | yes (490) |
| `0x12B4` | scary painting | furniture | 1960 | no | yes (490) |
| `0x12B8` | moving painting | furniture | 1960 | no | yes (490) |
| `0x12BC` | flowery painting | furniture | 1960 | no | yes (490) |
| `0x12C0` | common painting | furniture | 1960 | no | yes (490) |
| `0x12C4` | quaint painting | furniture | 1960 | no | yes (490) |
| `0x12C8` | dainty painting | furniture | 1960 | no | yes (490) |
| `0x12CC` | amazing painting | furniture | 1960 | no | yes (490) |
| `0x12D0` | strange painting | furniture | 1960 | no | yes (490) |
| `0x12D4` | rare painting | furniture | 1960 | no | yes (490) |
| `0x12D8` | classic painting | furniture | 1960 | no | yes (490) |
| `0x12DC` | perfect painting | furniture | 1960 | no | yes (490) |
| `0x12E0` | fine painting | furniture | 1960 | no | yes (490) |
| `0x12E4` | worthy painting | furniture | 1960 | no | yes (490) |
| `0x12E8` | pineapple bed | furniture | 1990 | no | yes (497) |
| `0x12EC` | orange chair | furniture | 1300 | no | yes (325) |
| `0x12F0` | unused dresser | furniture | 0 | no | yes (0) |
| `0x12F4` | lemon table | furniture | 1500 | no | yes (375) |
| `0x12F8` | apple TV | furniture | 1600 | no | yes (400) |
| `0x12FC` | table tennis | furniture | 1800 | no | yes (450) |
| `0x1300` | harp | furniture | 1700 | no | yes (425) |
| `0x1304` | cabin clock | furniture | 2000 | no | yes (500) |
| `0x1308` | train set | furniture | 1600 | no | yes (400) |
| `0x130C` | water bird | furniture | 1400 | no | yes (350) |
| `0x1310` | wobbelina | furniture | 700 | no | yes (175) |
| `0x1314` | unused monkey | furniture | 700 | no | yes (175) |
| `0x1318` | slot machine | furniture | 777 | no | yes (194) |
| `0x131C` | exotic bench | furniture | 1900 | no | yes (475) |
| `0x1320` | exotic chair | furniture | 1400 | no | yes (350) |
| `0x1324` | exotic chest | furniture | 1800 | no | yes (450) |
| `0x1328` | exotic lamp | furniture | 1800 | no | yes (450) |
| `0x132C` | caladium | furniture | 1300 | no | yes (325) |
| `0x1330` | lady palm | furniture | 1200 | no | yes (300) |
| `0x1334` | exotic screen | furniture | 2250 | no | yes (562) |
| `0x1338` | exotic table | furniture | 2300 | no | yes (575) |
| `0x133C` | djimbe drum | furniture | 1900 | no | yes (475) |
| `0x1340` | modern bed | furniture | 2320 | no | yes (580) |
| `0x1344` | modern den chair | furniture | 1980 | no | yes (495) |
| `0x1348` | modern cabinet | furniture | 2580 | no | yes (645) |
| `0x134C` | modern desk | furniture | 2480 | no | yes (620) |
| `0x1350` | modern sofa | furniture | 2620 | no | yes (655) |
| `0x1354` | modern table | furniture | 1800 | no | yes (450) |
| `0x1358` | blue bed | furniture | 2100 | no | yes (525) |
| `0x135C` | blue bench | furniture | 1900 | no | yes (475) |
| `0x1360` | blue chair | furniture | 1200 | no | yes (300) |
| `0x1364` | blue dresser | furniture | 2100 | no | yes (525) |
| `0x1368` | blue bookcase | furniture | 1900 | no | yes (475) |
| `0x136C` | blue table | furniture | 1800 | no | yes (450) |
| `0x1370` | green bed | furniture | 2160 | no | yes (540) |
| `0x1374` | green bench | furniture | 1800 | no | yes (450) |
| `0x1378` | green chair | furniture | 1200 | no | yes (300) |
| `0x137C` | green pantry | furniture | 2290 | no | yes (572) |
| `0x1380` | green counter | furniture | 2400 | no | yes (600) |
| `0x1384` | green lamp | furniture | 1800 | no | yes (450) |
| `0x1388` | green table | furniture | 1700 | no | yes (425) |
| `0x138C` | cabin bed | furniture | 2400 | no | yes (600) |
| `0x1390` | cabin couch | furniture | 2480 | no | yes (620) |
| `0x1394` | cabin armchair | furniture | 2280 | no | yes (570) |
| `0x1398` | cabin bookcase | furniture | 2300 | no | yes (575) |
| `0x139C` | cabin low table | furniture | 2100 | no | yes (525) |
| `0x13A0` | aloe | furniture | 1200 | no | yes (300) |
| `0x13A4` | bromeliaceae | furniture | 1300 | no | yes (325) |
| `0x13A8` | coconut palm | furniture | 1200 | no | yes (300) |
| `0x13AC` | snake plant | furniture | 1200 | no | yes (300) |
| `0x13B0` | dracaena | furniture | 2000 | no | yes (500) |
| `0x13B4` | rubber tree | furniture | 1300 | no | yes (325) |
| `0x13B8` | pothos | furniture | 1300 | no | yes (325) |
| `0x13BC` | fan palm | furniture | 1300 | no | yes (325) |
| `0x13C0` | grapefruit table | furniture | 1500 | no | yes (375) |
| `0x13C4` | lime chair | furniture | 1300 | no | yes (325) |
| `0x13C8` | weeping fig | furniture | 1200 | no | yes (300) |
| `0x13CC` | corn plant | furniture | 1300 | no | yes (325) |
| `0x13D0` | croton | furniture | 1300 | no | yes (325) |
| `0x13D4` | pachira | furniture | 1200 | no | yes (300) |
| `0x13D8` | cactus | furniture | 1700 | no | yes (425) |
| `0x13DC` | metronome | furniture | 1000 | no | yes (250) |
| `0x13E0` | deer scare | furniture | 1800 | no | yes (450) |
| `0x13E4` | pine bonsai | furniture | 1800 | no | yes (450) |
| `0x13E8` | mugho bonsai | furniture | 1800 | no | yes (450) |
| `0x13EC` | barber's pole | furniture | 1600 | no | yes (400) |
| `0x13F0` | ponderosa bonsai | furniture | 1800 | no | yes (450) |
| `0x13F4` | plum bonsai | furniture | 1900 | no | yes (475) |
| `0x13F8` | giant dharma | furniture | 1600 | no | yes (400) |
| `0x13FC` | dharma | furniture | 1200 | no | yes (300) |
| `0x1400` | mini-dharma | furniture | 800 | no | yes (200) |
| `0x1404` | quince bonsai | furniture | 1600 | no | yes (400) |
| `0x1408` | azalea bonsai | furniture | 1500 | no | yes (375) |
| `0x140C` | jasmine bonsai | furniture | 1700 | no | yes (425) |
| `0x1410` | executive toy | furniture | 1100 | no | yes (275) |
| `0x1414` | traffic cone | furniture | 800 | no | yes (200) |
| `0x1418` | striped cone | furniture | 800 | no | yes (200) |
| `0x141C` | orange cone | furniture | 600 | no | yes (150) |
| `0x1420` | cola machine | furniture | 1700 | no | yes (425) |
| `0x1424` | maple bonsai | furniture | 1700 | no | yes (425) |
| `0x1428` | hawthorn bonsai | furniture | 1800 | no | yes (450) |
| `0x142C` | holly bonsai | furniture | 1600 | no | yes (400) |
| `0x1430` | barricade | furniture | 1200 | no | yes (300) |
| `0x1434` | fence | furniture | 1200 | no | yes (300) |
| `0x1438` | plastic fence | furniture | 1400 | no | yes (350) |
| `0x143C` | fence and sign | furniture | 1400 | no | yes (350) |
| `0x1440` | soda machine | furniture | 1700 | no | yes (425) |
| `0x1444` | manhole cover | furniture | 1000 | no | yes (250) |
| `0x1448` | pop machine | furniture | 3250 | no | yes (812) |
| `0x144C` | brown drum | furniture | 800 | no | yes (200) |
| `0x1450` | green drum | furniture | 800 | no | yes (200) |
| `0x1454` | red drum | furniture | 800 | no | yes (200) |
| `0x1458` | juice machine | furniture | 1700 | no | yes (425) |
| `0x145C` | iron frame | furniture | 1200 | no | yes (300) |
| `0x1460` | trash can | furniture | 1400 | no | yes (350) |
| `0x1464` | garbage pail | furniture | 1100 | no | yes (275) |
| `0x1468` | watermelon chair | furniture | 1300 | no | yes (325) |
| `0x146C` | melon chair | furniture | 1300 | no | yes (325) |
| `0x1470` | watermelon table | furniture | 1800 | no | yes (450) |
| `0x1474` | robotic flagman | furniture | 2300 | no | yes (575) |
| `0x1478` | garbage can | furniture | 500 | no | yes (125) |
| `0x147C` | trash bin | furniture | 500 | no | yes (125) |
| `0x1480` | violin | furniture | 2200 | no | yes (550) |
| `0x1484` | bass | furniture | 2400 | no | yes (600) |
| `0x1488` | cello | furniture | 1800 | no | yes (450) |
| `0x148C` | ebony piano | furniture | 3800 | no | yes (950) |
| `0x1490` | zen basin | furniture | 1840 | no | yes (460) |
| `0x1494` | handcart | furniture | 800 | no | yes (200) |
| `0x1498` | wash basin | furniture | 1750 | no | yes (437) |
| `0x149C` | jack-o'-lantern | furniture | 0 | no | yes (0) |
| `0x14A0` | warning sign | furniture | 1800 | no | yes (450) |
| `0x14A4` | detour arrow | furniture | 600 | no | yes (150) |
| `0x14A8` | garden stone | furniture | 1900 | no | yes (475) |
| `0x14AC` | standing stone | furniture | 2500 | no | yes (625) |
| `0x14B0` | route sign | furniture | 1400 | no | yes (350) |
| `0x14B4` | men working sign | furniture | 800 | no | yes (200) |
| `0x14B8` | caution sign | furniture | 1600 | no | yes (400) |
| `0x14BC` | temple basin | furniture | 1980 | no | yes (495) |
| `0x14C0` | spooky bed | furniture | 41240 | no | yes (10310) |
| `0x14C4` | jack-in-the-box | furniture | 4124 | no | yes (1031) |
| `0x14C8` | spooky chair | furniture | 41240 | no | yes (10310) |
| `0x14CC` | unused chair | furniture | 0 | no | yes (0) |
| `0x14D0` | spooky bookcase | furniture | 41240 | no | yes (10310) |
| `0x14D4` | spooky sofa | furniture | 41240 | no | yes (10310) |
| `0x14D8` | spooky table | furniture | 41240 | no | yes (10310) |
| `0x14DC` | lunar lander | furniture | 3200 | no | yes (800) |
| `0x14E0` | satellite | furniture | 2600 | no | yes (650) |
| `0x14E4` | mossy stone | furniture | 2160 | no | yes (540) |
| `0x14E8` | leaning stone | furniture | 2100 | no | yes (525) |
| `0x14EC` | dark stone | furniture | 2200 | no | yes (550) |
| `0x14F0` | flying saucer | furniture | 2400 | no | yes (600) |
| `0x14F4` | stone couple | furniture | 2380 | no | yes (595) |
| `0x14F8` | garden pond | furniture | 2580 | no | yes (645) |
| `0x14FC` | rocket | furniture | 2400 | no | yes (600) |
| `0x1500` | Spaceman Sam | furniture | 2800 | no | yes (700) |
| `0x1504` | spooky clock | furniture | 41240 | no | yes (10310) |
| `0x1508` | spooky lamp | furniture | 41240 | no | yes (10310) |
| `0x150C` | exotic bed | furniture | 2540 | no | yes (635) |
| `0x1510` | exotic end table | furniture | 1600 | no | yes (400) |
| `0x1514` | asteroid | furniture | 1800 | no | yes (450) |
| `0x1518` | cabana lamp | furniture | 1700 | no | yes (425) |
| `0x151C` | cabana table | furniture | 1800 | no | yes (450) |
| `0x1520` | bucket | furniture | 600 | no | yes (150) |
| `0x1524` | scale | furniture | 1200 | no | yes (300) |
| `0x1528` | faucet | furniture | 2880 | no | yes (720) |
| `0x152C` | spa chair | furniture | 600 | no | yes (150) |
| `0x1530` | cabana screen | furniture | 2000 | no | yes (500) |
| `0x1534` | cabana vanity | furniture | 1800 | no | yes (450) |
| `0x1538` | cabana chair | furniture | 1600 | no | yes (400) |
| `0x153C` | cabana bookcase | furniture | 2400 | no | yes (600) |
| `0x1540` | Arwing | furniture | 25600 | no | yes (6400) |
| `0x1544` | lunar rover | furniture | 2560 | no | yes (640) |
| `0x1548` | massage chair | furniture | 1600 | no | yes (400) |
| `0x154C` | bath mat | furniture | 600 | no | yes (150) |
| `0x1550` | spa tub | furniture | 2340 | no | yes (585) |
| `0x1554` | blue clock | furniture | 1600 | no | yes (400) |
| `0x1558` | mochi pestle | furniture | 1400 | no | yes (350) |
| `0x155C` | spooky vanity | furniture | 41240 | no | yes (10310) |
| `0x1560` | green desk | furniture | 2000 | no | yes (500) |
| `0x1564` | clerk's booth | furniture | 2200 | no | yes (550) |
| `0x1568` | modern chair | furniture | 1500 | no | yes (375) |
| `0x156C` | modern end table | furniture | 1900 | no | yes (475) |
| `0x1570` | space station | furniture | 2800 | no | yes (700) |
| `0x1574` | spa screen | furniture | 1500 | no | yes (375) |
| `0x1578` | cabin chair | furniture | 1700 | no | yes (425) |
| `0x157C` | regal bed | furniture | 3120 | no | yes (780) |
| `0x1580` | space shuttle | furniture | 2780 | no | yes (695) |
| `0x1584` | regal vanity | furniture | 3200 | no | yes (800) |
| `0x1588` | regal sofa | furniture | 3100 | no | yes (775) |
| `0x158C` | regal lamp | furniture | 2400 | no | yes (600) |
| `0x1590` | cabin table | furniture | 2100 | no | yes (525) |
| `0x1594` | bath locker | furniture | 2000 | no | yes (500) |
| `0x1598` | milk fridge | furniture | 1900 | no | yes (475) |
| `0x159C` | tea set | furniture | 300 | no | yes (75) |
| `0x15A0` | Nook's portrait | furniture | 480 | no | yes (120) |
| `0x15A4` | gerbera | furniture | 780 | no | yes (195) |
| `0x15A8` | sunflower | furniture | 980 | no | yes (245) |
| `0x15AC` | daffodil | furniture | 680 | no | yes (170) |
| `0x15B0` | tall gongoid | furniture | 3312 | no | yes (828) |
| `0x15B4` | mega gongoid | furniture | 3312 | no | yes (828) |
| `0x15B8` | mini gongoid | furniture | 3312 | no | yes (828) |
| `0x15BC` | gongoid | furniture | 3312 | no | yes (828) |
| `0x15C0` | mini oombloid | furniture | 3312 | no | yes (828) |
| `0x15C4` | oombloid | furniture | 3312 | no | yes (828) |
| `0x15C8` | mega oombloid | furniture | 3312 | no | yes (828) |
| `0x15CC` | tall oombloid | furniture | 3312 | no | yes (828) |
| `0x15D0` | mega echoid | furniture | 3312 | no | yes (828) |
| `0x15D4` | mini echoid | furniture | 3312 | no | yes (828) |
| `0x15D8` | tall echoid | furniture | 3312 | no | yes (828) |
| `0x15DC` | mini sputnoid | furniture | 3312 | no | yes (828) |
| `0x15E0` | sputnoid | furniture | 3312 | no | yes (828) |
| `0x15E4` | mega sputnoid | furniture | 3312 | no | yes (828) |
| `0x15E8` | tall sputnoid | furniture | 3312 | no | yes (828) |
| `0x15EC` | mini dinkoid | furniture | 3312 | no | yes (828) |
| `0x15F0` | mini fizzoid | furniture | 3312 | no | yes (828) |
| `0x15F4` | mega fizzoid | furniture | 3312 | no | yes (828) |
| `0x15F8` | mega dinkoid | furniture | 3312 | no | yes (828) |
| `0x15FC` | mini gargloid | furniture | 3312 | no | yes (828) |
| `0x1600` | gargloid | furniture | 3312 | no | yes (828) |
| `0x1604` | tall gargloid | furniture | 3312 | no | yes (828) |
| `0x1608` | mega buzzoid | furniture | 3312 | no | yes (828) |
| `0x160C` | tall buzzoid | furniture | 3312 | no | yes (828) |
| `0x1610` | buzzoid | furniture | 3312 | no | yes (828) |
| `0x1614` | mini buzzoid | furniture | 3312 | no | yes (828) |
| `0x1618` | sproid | furniture | 3312 | no | yes (828) |
| `0x161C` | mini sproid | furniture | 3312 | no | yes (828) |
| `0x1620` | mega sproid | furniture | 3312 | no | yes (828) |
| `0x1624` | tall sproid | furniture | 3312 | no | yes (828) |
| `0x1628` | tootoid | furniture | 3312 | no | yes (828) |
| `0x162C` | mini tootoid | furniture | 3312 | no | yes (828) |
| `0x1630` | mega tootoid | furniture | 3312 | no | yes (828) |
| `0x1634` | tall droploid | furniture | 3312 | no | yes (828) |
| `0x1638` | mega bovoid | furniture | 3312 | no | yes (828) |
| `0x163C` | tall bovoid | furniture | 3312 | no | yes (828) |
| `0x1640` | mini metatoid | furniture | 3312 | no | yes (828) |
| `0x1644` | metatoid | furniture | 3312 | no | yes (828) |
| `0x1648` | mini bowtoid | furniture | 3312 | no | yes (828) |
| `0x164C` | bowtoid | furniture | 3312 | no | yes (828) |
| `0x1650` | mega bowtoid | furniture | 3312 | no | yes (828) |
| `0x1654` | tall bowtoid | furniture | 3312 | no | yes (828) |
| `0x1658` | mega lamentoid | furniture | 3312 | no | yes (828) |
| `0x165C` | tall lamentoid | furniture | 3312 | no | yes (828) |
| `0x1660` | lamentoid | furniture | 3312 | no | yes (828) |
| `0x1664` | mini lamentoid | furniture | 3312 | no | yes (828) |
| `0x1668` | mini timpanoid | furniture | 3312 | no | yes (828) |
| `0x166C` | timpanoid | furniture | 3312 | no | yes (828) |
| `0x1670` | mega timpanoid | furniture | 3312 | no | yes (828) |
| `0x1674` | quazoid | furniture | 3312 | no | yes (828) |
| `0x1678` | mega quazoid | furniture | 3312 | no | yes (828) |
| `0x167C` | mega dekkoid | furniture | 3312 | no | yes (828) |
| `0x1680` | dekkoid | furniture | 3312 | no | yes (828) |
| `0x1684` | mini dekkoid | furniture | 3312 | no | yes (828) |
| `0x1688` | mega alloid | furniture | 3312 | no | yes (828) |
| `0x168C` | tall alloid | furniture | 3312 | no | yes (828) |
| `0x1690` | mini alloid | furniture | 3312 | no | yes (828) |
| `0x1694` | mini freakoid | furniture | 3312 | no | yes (828) |
| `0x1698` | mega freakoid | furniture | 3312 | no | yes (828) |
| `0x169C` | tall quazoid | furniture | 3312 | no | yes (828) |
| `0x16A0` | mini quazoid | furniture | 3312 | no | yes (828) |
| `0x16A4` | squat dingloid | furniture | 3312 | no | yes (828) |
| `0x16A8` | mega dingloid | furniture | 3312 | no | yes (828) |
| `0x16AC` | tall dingloid | furniture | 3312 | no | yes (828) |
| `0x16B0` | dingloid | furniture | 3312 | no | yes (828) |
| `0x16B4` | mini dingloid | furniture | 3312 | no | yes (828) |
| `0x16B8` | wee dingloid | furniture | 3312 | no | yes (828) |
| `0x16BC` | mega clankoid | furniture | 3312 | no | yes (828) |
| `0x16C0` | clankoid | furniture | 3312 | no | yes (828) |
| `0x16C4` | tall clankoid | furniture | 3312 | no | yes (828) |
| `0x16C8` | mini clankoid | furniture | 3312 | no | yes (828) |
| `0x16CC` | croakoid | furniture | 3312 | no | yes (828) |
| `0x16D0` | mega croakoid | furniture | 3312 | no | yes (828) |
| `0x16D4` | tall croakoid | furniture | 3312 | no | yes (828) |
| `0x16D8` | mini croakoid | furniture | 3312 | no | yes (828) |
| `0x16DC` | mega poltergoid | furniture | 3312 | no | yes (828) |
| `0x16E0` | tall poltergoid | furniture | 3312 | no | yes (828) |
| `0x16E4` | poltergoid | furniture | 3312 | no | yes (828) |
| `0x16E8` | mini poltergoid | furniture | 3312 | no | yes (828) |
| `0x16EC` | tall warbloid | furniture | 3312 | no | yes (828) |
| `0x16F0` | warbloid | furniture | 3312 | no | yes (828) |
| `0x16F4` | mini warbloid | furniture | 3312 | no | yes (828) |
| `0x16F8` | mega rustoid | furniture | 3312 | no | yes (828) |
| `0x16FC` | rustoid | furniture | 3312 | no | yes (828) |
| `0x1700` | mini rustoid | furniture | 3312 | no | yes (828) |
| `0x1704` | mega percoloid | furniture | 3312 | no | yes (828) |
| `0x1708` | tall percoloid | furniture | 3312 | no | yes (828) |
| `0x170C` | mega puffoid | furniture | 3312 | no | yes (828) |
| `0x1710` | mini puffoid | furniture | 3312 | no | yes (828) |
| `0x1714` | tall puffoid | furniture | 3312 | no | yes (828) |
| `0x1718` | rhythmoid | furniture | 3312 | no | yes (828) |
| `0x171C` | mini rhythmoid | furniture | 3312 | no | yes (828) |
| `0x1720` | slim quazoid | furniture | 3312 | no | yes (828) |
| `0x1724` | mega oboid | furniture | 3312 | no | yes (828) |
| `0x1728` | oboid | furniture | 3312 | no | yes (828) |
| `0x172C` | tall oboid | furniture | 3312 | no | yes (828) |
| `0x1730` | tall timpanoid | furniture | 3312 | no | yes (828) |
| `0x1734` | mini howloid | furniture | 3312 | no | yes (828) |
| `0x1738` | howloid | furniture | 3312 | no | yes (828) |
| `0x173C` | mega howloid | furniture | 3312 | no | yes (828) |
| `0x1740` | mega harmonoid | furniture | 3312 | no | yes (828) |
| `0x1744` | harmonoid | furniture | 3312 | no | yes (828) |
| `0x1748` | tall harmonoid | furniture | 3312 | no | yes (828) |
| `0x174C` | mini harmonoid | furniture | 3312 | no | yes (828) |
| `0x1750` | tall strumboid | furniture | 3312 | no | yes (828) |
| `0x1754` | mega strumboid | furniture | 3312 | no | yes (828) |
| `0x1758` | strumboid | furniture | 3312 | no | yes (828) |
| `0x175C` | mini strumboid | furniture | 3312 | no | yes (828) |
| `0x1760` | mega lullaboid | furniture | 3312 | no | yes (828) |
| `0x1764` | tall lullaboid | furniture | 3312 | no | yes (828) |
| `0x1768` | lullaboid | furniture | 3312 | no | yes (828) |
| `0x176C` | mini lullaboid | furniture | 3312 | no | yes (828) |
| `0x1770` | mega drilloid | furniture | 3312 | no | yes (828) |
| `0x1774` | drilloid | furniture | 3312 | no | yes (828) |
| `0x1778` | mini drilloid | furniture | 3312 | no | yes (828) |
| `0x177C` | mega nebuloid | furniture | 3312 | no | yes (828) |
| `0x1780` | nebuloid | furniture | 3312 | no | yes (828) |
| `0x1784` | squat nebuloid | furniture | 3312 | no | yes (828) |
| `0x1788` | tall nebuloid | furniture | 3312 | no | yes (828) |
| `0x178C` | mini nebuloid | furniture | 3312 | no | yes (828) |
| `0x1790` | slim nebuloid | furniture | 3312 | no | yes (828) |
| `0x1794` | mega plinkoid | furniture | 3312 | no | yes (828) |
| `0x1798` | plinkoid | furniture | 3312 | no | yes (828) |
| `0x179C` | mini plinkoid | furniture | 3312 | no | yes (828) |
| `0x17A0` | squelchoid | furniture | 3312 | no | yes (828) |
| `0x17A4` | mega squelchoid | furniture | 3312 | no | yes (828) |
| `0x17A8` | mini squelchoid | furniture | 3312 | no | yes (828) |
| `0x17AC` | flame shirt | furniture | 360 | no | yes (90) |
| `0x17B0` | paw shirt | furniture | 360 | no | yes (90) |
| `0x17B4` | wavy pink shirt | furniture | 360 | no | yes (90) |
| `0x17B8` | future shirt | furniture | 390 | no | yes (97) |
| `0x17BC` | bold check shirt | furniture | 360 | no | yes (90) |
| `0x17C0` | mint gingham | furniture | 330 | no | yes (82) |
| `0x17C4` | bad plaid shirt | furniture | 420 | no | yes (105) |
| `0x17C8` | speedway shirt | furniture | 290 | no | yes (72) |
| `0x17CC` | folk shirt | furniture | 380 | no | yes (95) |
| `0x17D0` | daisy shirt | furniture | 380 | no | yes (95) |
| `0x17D4` | wavy tan shirt | furniture | 360 | no | yes (90) |
| `0x17D8` | optical shirt | furniture | 430 | no | yes (107) |
| `0x17DC` | rugby shirt | furniture | 360 | no | yes (90) |
| `0x17E0` | sherbet gingham | furniture | 330 | no | yes (82) |
| `0x17E4` | yellow tartan | furniture | 430 | no | yes (107) |
| `0x17E8` | gelato shirt | furniture | 330 | no | yes (82) |
| `0x17EC` | work uniform | furniture | 0 | no | yes (0) |
| `0x17F0` | patched shirt | furniture | 0 | no | yes (0) |
| `0x17F4` | plum kimono | furniture | 0 | no | yes (0) |
| `0x17F8` | somber robe | furniture | 0 | no | yes (0) |
| `0x17FC` | red sweatsuit | furniture | 0 | no | yes (0) |
| `0x1800` | blue sweatsuit | furniture | 0 | no | yes (0) |
| `0x1804` | red puffy vest | furniture | 0 | no | yes (0) |
| `0x1808` | blue puffy vest | furniture | 0 | no | yes (0) |
| `0x180C` | summer robe | furniture | 0 | no | yes (0) |
| `0x1810` | bamboo robe | furniture | 0 | no | yes (0) |
| `0x1814` | red aloha shirt | furniture | 0 | no | yes (0) |
| `0x1818` | blue aloha shirt | furniture | 0 | no | yes (0) |
| `0x181C` | dark polka shirt | furniture | 350 | no | yes (87) |
| `0x1820` | lite polka shirt | furniture | 380 | no | yes (95) |
| `0x1824` | lovely shirt | furniture | 400 | no | yes (100) |
| `0x1828` | citrus shirt | furniture | 6400 | no | yes (1600) |
| `0x182C` | kiwi shirt | furniture | 6400 | no | yes (1600) |
| `0x1830` | watermelon shirt | furniture | 6400 | no | yes (1600) |
| `0x1834` | strawberry shirt | furniture | 6400 | no | yes (1600) |
| `0x1838` | grape shirt | furniture | 6400 | no | yes (1600) |
| `0x183C` | melon shirt | furniture | 6400 | no | yes (1600) |
| `0x1840` | Jingle shirt | furniture | 0 | no | yes (0) |
| `0x1844` | blossom shirt | furniture | 370 | no | yes (92) |
| `0x1848` | icy shirt | furniture | 390 | no | yes (97) |
| `0x184C` | crewel shirt | furniture | 380 | no | yes (95) |
| `0x1850` | tropical shirt | furniture | 370 | no | yes (92) |
| `0x1854` | ribbon shirt | furniture | 370 | no | yes (92) |
| `0x1858` | fall plaid shirt | furniture | 370 | no | yes (92) |
| `0x185C` | fiendish shirt | furniture | 6800 | no | yes (1700) |
| `0x1860` | chevron shirt | furniture | 320 | no | yes (80) |
| `0x1864` | ladybug shirt | furniture | 5400 | no | yes (1350) |
| `0x1868` | botanical shirt | furniture | 420 | no | yes (105) |
| `0x186C` | Anju's shirt | furniture | 460 | no | yes (115) |
| `0x1870` | Kaffe's shirt | furniture | 460 | no | yes (115) |
| `0x1874` | lavender robe | furniture | 5800 | no | yes (1450) |
| `0x1878` | blue grid shirt | furniture | 340 | no | yes (85) |
| `0x187C` | butterfly shirt | furniture | 7200 | no | yes (1800) |
| `0x1880` | blue tartan | furniture | 390 | no | yes (97) |
| `0x1884` | Gracie's top | furniture | 6200 | no | yes (1550) |
| `0x1888` | orange tie-dye | furniture | 380 | no | yes (95) |
| `0x188C` | purple tie-dye | furniture | 380 | no | yes (95) |
| `0x1890` | green tie-dye | furniture | 380 | no | yes (95) |
| `0x1894` | blue tie-dye | furniture | 380 | no | yes (95) |
| `0x1898` | red tie-dye | furniture | 380 | no | yes (95) |
| `0x189C` | one-ball shirt | furniture | 340 | no | yes (85) |
| `0x18A0` | two-ball shirt | furniture | 340 | no | yes (85) |
| `0x18A4` | three-ball shirt | furniture | 340 | no | yes (85) |
| `0x18A8` | four-ball shirt | furniture | 340 | no | yes (85) |
| `0x18AC` | five-ball shirt | furniture | 340 | no | yes (85) |
| `0x18B0` | six-ball shirt | furniture | 340 | no | yes (85) |
| `0x18B4` | seven-ball shirt | furniture | 340 | no | yes (85) |
| `0x18B8` | eight-ball shirt | furniture | 340 | no | yes (85) |
| `0x18BC` | nine-ball shirt | furniture | 340 | no | yes (85) |
| `0x18C0` | arctic camo | furniture | 320 | no | yes (80) |
| `0x18C4` | jungle camo | furniture | 320 | no | yes (80) |
| `0x18C8` | desert camo | furniture | 320 | no | yes (80) |
| `0x18CC` | rally shirt | furniture | 380 | no | yes (95) |
| `0x18D0` | racer shirt | furniture | 380 | no | yes (95) |
| `0x18D4` | racer 6 shirt | furniture | 380 | no | yes (95) |
| `0x18D8` | fish bone shirt | furniture | 340 | no | yes (85) |
| `0x18DC` | spiderweb shirt | furniture | 320 | no | yes (80) |
| `0x18E0` | zipper shirt | furniture | 320 | no | yes (80) |
| `0x18E4` | bubble shirt | furniture | 410 | no | yes (102) |
| `0x18E8` | yellow bolero | furniture | 430 | no | yes (107) |
| `0x18EC` | nebula shirt | furniture | 390 | no | yes (97) |
| `0x18F0` | neo-classic knit | furniture | 380 | no | yes (95) |
| `0x18F4` | noble shirt | furniture | 380 | no | yes (95) |
| `0x18F8` | turnip top | furniture | 350 | no | yes (87) |
| `0x18FC` | oft-seen print | furniture | 320 | no | yes (80) |
| `0x1900` | ski sweater | furniture | 320 | no | yes (80) |
| `0x1904` | circus shirt | furniture | 370 | no | yes (92) |
| `0x1908` | patchwork top | furniture | 340 | no | yes (85) |
| `0x190C` | mod top | furniture | 340 | no | yes (85) |
| `0x1910` | hippie shirt | furniture | 360 | no | yes (90) |
| `0x1914` | rickrack shirt | furniture | 360 | no | yes (90) |
| `0x1918` | diner uniform | furniture | 290 | no | yes (72) |
| `0x191C` | shirt circuit | furniture | 5120 | no | yes (1280) |
| `0x1920` | U R here shirt | furniture | 350 | no | yes (87) |
| `0x1924` | yodel shirt | furniture | 350 | no | yes (87) |
| `0x1928` | pulse shirt | furniture | 6000 | no | yes (1500) |
| `0x192C` | prism shirt | furniture | 370 | no | yes (92) |
| `0x1930` | star shirt | furniture | 370 | no | yes (92) |
| `0x1934` | straw shirt | furniture | 360 | no | yes (90) |
| `0x1938` | noodle shirt | furniture | 380 | no | yes (95) |
| `0x193C` | dice shirt | furniture | 340 | no | yes (85) |
| `0x1940` | kiddie shirt | furniture | 340 | no | yes (85) |
| `0x1944` | frog shirt | furniture | 340 | no | yes (85) |
| `0x1948` | moody blue shirt | furniture | 123 | no | yes (30) |
| `0x194C` | cloudy shirt | furniture | 320 | no | yes (80) |
| `0x1950` | fortune shirt | furniture | 480 | no | yes (120) |
| `0x1954` | skull shirt | furniture | 320 | no | yes (80) |
| `0x1958` | desert shirt | furniture | 390 | no | yes (97) |
| `0x195C` | aurora knit | furniture | 380 | no | yes (95) |
| `0x1960` | winter sweater | furniture | 290 | no | yes (72) |
| `0x1964` | go-go shirt | furniture | 360 | no | yes (90) |
| `0x1968` | jade check print | furniture | 360 | no | yes (90) |
| `0x196C` | blue check print | furniture | 360 | no | yes (90) |
| `0x1970` | red grid shirt | furniture | 360 | no | yes (90) |
| `0x1974` | flicker shirt | furniture | 360 | no | yes (90) |
| `0x1978` | floral knit | furniture | 420 | no | yes (105) |
| `0x197C` | rose shirt | furniture | 480 | no | yes (120) |
| `0x1980` | sunset top | furniture | 290 | no | yes (72) |
| `0x1984` | chain-gang shirt | furniture | 260 | no | yes (65) |
| `0x1988` | spring shirt | furniture | 320 | no | yes (80) |
| `0x198C` | bear shirt | furniture | 390 | no | yes (97) |
| `0x1990` | MVP shirt | furniture | 370 | no | yes (92) |
| `0x1994` | silk bloom shirt | furniture | 480 | no | yes (120) |
| `0x1998` | pop bloom shirt | furniture | 360 | no | yes (90) |
| `0x199C` | loud bloom shirt | furniture | 360 | no | yes (90) |
| `0x19A0` | hot spring shirt | furniture | 520 | no | yes (130) |
| `0x19A4` | new spring shirt | furniture | 520 | no | yes (130) |
| `0x19A8` | deep blue tee | furniture | 380 | no | yes (95) |
| `0x19AC` | snowcone shirt | furniture | 420 | no | yes (105) |
| `0x19B0` | ugly shirt | furniture | 420 | no | yes (105) |
| `0x19B4` | sharp outfit | furniture | 290 | no | yes (72) |
| `0x19B8` | painter's smock | furniture | 360 | no | yes (90) |
| `0x19BC` | spade shirt | furniture | 340 | no | yes (85) |
| `0x19C0` | blossoming shirt | furniture | 390 | no | yes (97) |
| `0x19C4` | peachy shirt | furniture | 390 | no | yes (97) |
| `0x19C8` | static shirt | furniture | 360 | no | yes (90) |
| `0x19CC` | rainbow shirt | furniture | 777 | no | yes (194) |
| `0x19D0` | groovy shirt | furniture | 6400 | no | yes (1600) |
| `0x19D4` | loud line shirt | furniture | 370 | no | yes (92) |
| `0x19D8` | dazed shirt | furniture | 350 | no | yes (87) |
| `0x19DC` | red bar shirt | furniture | 360 | no | yes (90) |
| `0x19E0` | blue stripe knit | furniture | 340 | no | yes (85) |
| `0x19E4` | earthy knit | furniture | 390 | no | yes (97) |
| `0x19E8` | spunky knit | furniture | 360 | no | yes (90) |
| `0x19EC` | deer shirt | furniture | 380 | no | yes (95) |
| `0x19F0` | blue check shirt | furniture | 380 | no | yes (95) |
| `0x19F4` | light line shirt | furniture | 380 | no | yes (95) |
| `0x19F8` | blue pinstripe | furniture | 380 | no | yes (95) |
| `0x19FC` | diamond shirt | furniture | 380 | no | yes (95) |
| `0x1A00` | lime line shirt | furniture | 380 | no | yes (95) |
| `0x1A04` | big bro's shirt | furniture | 320 | no | yes (80) |
| `0x1A08` | green bar shirt | furniture | 320 | no | yes (80) |
| `0x1A0C` | yellow bar shirt | furniture | 320 | no | yes (80) |
| `0x1A10` | monkey shirt | furniture | 380 | no | yes (95) |
| `0x1A14` | polar fleece | furniture | 360 | no | yes (90) |
| `0x1A18` | ancient knit | furniture | 390 | no | yes (97) |
| `0x1A1C` | fish knit | furniture | 380 | no | yes (95) |
| `0x1A20` | vertigo shirt | furniture | 370 | no | yes (92) |
| `0x1A24` | misty shirt | furniture | 380 | no | yes (95) |
| `0x1A28` | stormy shirt | furniture | 380 | no | yes (95) |
| `0x1A2C` | red scale shirt | furniture | 370 | no | yes (92) |
| `0x1A30` | blue scale shirt | furniture | 370 | no | yes (92) |
| `0x1A34` | heart shirt | furniture | 360 | no | yes (90) |
| `0x1A38` | yellow pinstripe | furniture | 360 | no | yes (90) |
| `0x1A3C` | club shirt | furniture | 360 | no | yes (90) |
| `0x1A40` | li'l bro's shirt | furniture | 320 | no | yes (80) |
| `0x1A44` | argyle knit | furniture | 460 | no | yes (115) |
| `0x1A48` | caveman tunic | furniture | 380 | no | yes (95) |
| `0x1A4C` | caf\| shirt | furniture | 420 | no | yes (105) |
| `0x1A50` | tiki shirt | furniture | 400 | no | yes (100) |
| `0x1A54` | A shirt | furniture | 370 | no | yes (92) |
| `0x1A58` | checkered shirt | furniture | 390 | no | yes (97) |
| `0x1A5C` | No.1 shirt | furniture | 250 | no | yes (62) |
| `0x1A60` | No.2 shirt | furniture | 250 | no | yes (62) |
| `0x1A64` | No.3 shirt | furniture | 250 | no | yes (62) |
| `0x1A68` | No.4 shirt | furniture | 250 | no | yes (62) |
| `0x1A6C` | No.5 shirt | furniture | 250 | no | yes (62) |
| `0x1A70` | No.23 shirt | furniture | 250 | no | yes (62) |
| `0x1A74` | No.67 shirt | furniture | 250 | no | yes (62) |
| `0x1A78` | BB shirt | furniture | 350 | no | yes (87) |
| `0x1A7C` | beatnik shirt | furniture | 360 | no | yes (90) |
| `0x1A80` | moldy shirt | furniture | 50 | no | yes (12) |
| `0x1A84` | houndstooth tee | furniture | 350 | no | yes (87) |
| `0x1A88` | big star shirt | furniture | 400 | no | yes (100) |
| `0x1A8C` | orange pinstripe | furniture | 5000 | no | yes (1250) |
| `0x1A90` | twinkle shirt | furniture | 480 | no | yes (120) |
| `0x1A94` | funky dot shirt | furniture | 430 | no | yes (107) |
| `0x1A98` | crossing shirt | furniture | 6200 | no | yes (1550) |
| `0x1A9C` | splendid shirt | furniture | 6200 | no | yes (1550) |
| `0x1AA0` | jagged shirt | furniture | 360 | no | yes (90) |
| `0x1AA4` | denim shirt | furniture | 390 | no | yes (97) |
| `0x1AA8` | cherry shirt | furniture | 380 | no | yes (95) |
| `0x1AAC` | gumdrop shirt | furniture | 390 | no | yes (97) |
| `0x1AB0` | barber shirt | furniture | 380 | no | yes (95) |
| `0x1AB4` | concierge shirt | furniture | 350 | no | yes (87) |
| `0x1AB8` | fresh shirt | furniture | 380 | no | yes (95) |
| `0x1ABC` | far-out shirt | furniture | 380 | no | yes (95) |
| `0x1AC0` | dawn shirt | furniture | 380 | no | yes (95) |
| `0x1AC4` | striking outfit | furniture | 460 | no | yes (115) |
| `0x1AC8` | red check shirt | furniture | 330 | no | yes (82) |
| `0x1ACC` | berry gingham | furniture | 330 | no | yes (82) |
| `0x1AD0` | lemon gingham | furniture | 330 | no | yes (82) |
| `0x1AD4` | dragon suit | furniture | 340 | no | yes (85) |
| `0x1AD8` | G logo shirt | furniture | 128 | no | yes (32) |
| `0x1ADC` | tin shirt | furniture | 6400 | no | yes (1600) |
| `0x1AE0` | jester shirt | furniture | 420 | no | yes (105) |
| `0x1AE4` | pink tartan | furniture | 420 | no | yes (105) |
| `0x1AE8` | waffle shirt | furniture | 430 | no | yes (107) |
| `0x1AEC` | gray tartan | furniture | 420 | no | yes (105) |
| `0x1AF0` | windsock shirt | furniture | 320 | no | yes (80) |
| `0x1AF4` | trendy top | furniture | 360 | no | yes (90) |
| `0x1AF8` | green ring shirt | furniture | 180 | no | yes (45) |
| `0x1AFC` | white ring shirt | furniture | 180 | no | yes (45) |
| `0x1B00` | snappy print | furniture | 320 | no | yes (80) |
| `0x1B04` | chichi print | furniture | 180 | no | yes (45) |
| `0x1B08` | wave print | furniture | 380 | no | yes (95) |
| `0x1B0C` | checkerboard tee | furniture | 340 | no | yes (85) |
| `0x1B10` | subdued print | furniture | 320 | no | yes (80) |
| `0x1B14` | airy shirt | furniture | 420 | no | yes (105) |
| `0x1B18` | coral shirt | furniture | 6200 | no | yes (1550) |
| `0x1B1C` | leather jerkin | furniture | 390 | no | yes (97) |
| `0x1B20` | zebra print | furniture | 6400 | no | yes (1600) |
| `0x1B24` | tiger print | furniture | 6400 | no | yes (1600) |
| `0x1B28` | cow print | furniture | 6400 | no | yes (1600) |
| `0x1B2C` | leopard print | furniture | 6400 | no | yes (1600) |
| `0x1B30` | danger shirt | furniture | 340 | no | yes (85) |
| `0x1B34` | big dot shirt | furniture | 340 | no | yes (85) |
| `0x1B38` | puzzling shirt | furniture | 320 | no | yes (80) |
| `0x1B3C` | exotic shirt | furniture | 380 | no | yes (95) |
| `0x1B40` | houndstooth knit | furniture | 370 | no | yes (92) |
| `0x1B44` | uncommon shirt | furniture | 360 | no | yes (90) |
| `0x1B48` | dapper shirt | furniture | 350 | no | yes (87) |
| `0x1B4C` | gaudy sweater | furniture | 330 | no | yes (82) |
| `0x1B50` | cozy sweater | furniture | 350 | no | yes (87) |
| `0x1B54` | comfy sweater | furniture | 360 | no | yes (90) |
| `0x1B58` | classic top | furniture | 350 | no | yes (87) |
| `0x1B5C` | vogue top | furniture | 380 | no | yes (95) |
| `0x1B60` | laced shirt | furniture | 370 | no | yes (92) |
| `0x1B64` | natty shirt | furniture | 380 | no | yes (95) |
| `0x1B68` | citrus gingham | furniture | 360 | no | yes (90) |
| `0x1B6C` | cool shirt | furniture | 6400 | no | yes (1600) |
| `0x1B70` | dreamy shirt | furniture | 390 | no | yes (97) |
| `0x1B74` | flowery shirt | furniture | 400 | no | yes (100) |
| `0x1B78` | caterpillar tee | furniture | 6800 | no | yes (1700) |
| `0x1B7C` | shortcake shirt | furniture | 330 | no | yes (82) |
| `0x1B80` | whirly shirt | furniture | 350 | no | yes (87) |
| `0x1B84` | thunder shirt | furniture | 320 | no | yes (80) |
| `0x1B88` | giraffe print | furniture | 6200 | no | yes (1550) |
| `0x1B8C` | swell shirt | furniture | 6000 | no | yes (1500) |
| `0x1B90` | toad print | furniture | 340 | no | yes (85) |
| `0x1B94` | grass shirt | furniture | 5800 | no | yes (1450) |
| `0x1B98` | mosaic shirt | furniture | 350 | no | yes (87) |
| `0x1B9C` | fetching outfit | furniture | 420 | no | yes (105) |
| `0x1BA0` | snow shirt | furniture | 6800 | no | yes (1700) |
| `0x1BA4` | melon gingham | furniture | 330 | no | yes (82) |
| `0x1BA8` | my mannequin 1 | furniture | 300 | no | yes (75) |
| `0x1BAC` | my mannequin 2 | furniture | 300 | no | yes (75) |
| `0x1BB0` | my mannequin 3 | furniture | 300 | no | yes (75) |
| `0x1BB4` | my mannequin 4 | furniture | 300 | no | yes (75) |
| `0x1BB8` | my mannequin 5 | furniture | 300 | no | yes (75) |
| `0x1BBC` | my mannequin 6 | furniture | 300 | no | yes (75) |
| `0x1BC0` | my mannequin 7 | furniture | 300 | no | yes (75) |
| `0x1BC4` | my mannequin 8 | furniture | 300 | no | yes (75) |
| `0x1BC8` | common butterfly | furniture | 320 | no | yes (80) |
| `0x1BCC` | yellow butterfly | furniture | 320 | no | yes (80) |
| `0x1BD0` | tiger butterfly | furniture | 800 | no | yes (200) |
| `0x1BD4` | purple butterfly | furniture | 8000 | no | yes (2000) |
| `0x1BD8` | robust cicada | furniture | 1200 | no | yes (300) |
| `0x1BDC` | walker cicada | furniture | 1600 | no | yes (400) |
| `0x1BE0` | evening cicada | furniture | 3400 | no | yes (850) |
| `0x1BE4` | brown cicada | furniture | 800 | no | yes (200) |
| `0x1BE8` | bee | furniture | 18000 | no | yes (4500) |
| `0x1BEC` | common dragonfly | furniture | 520 | no | yes (130) |
| `0x1BF0` | red dragonfly | furniture | 320 | no | yes (80) |
| `0x1BF4` | darner dragonfly | furniture | 800 | no | yes (200) |
| `0x1BF8` | banded dragonfly | furniture | 18000 | no | yes (4500) |
| `0x1BFC` | long locust | furniture | 800 | no | yes (200) |
| `0x1C00` | migratory locust | furniture | 5400 | no | yes (1350) |
| `0x1C04` | cricket | furniture | 520 | no | yes (130) |
| `0x1C08` | grasshopper | furniture | 520 | no | yes (130) |
| `0x1C0C` | bell cricket | furniture | 1720 | no | yes (430) |
| `0x1C10` | pine cricket | furniture | 400 | no | yes (100) |
| `0x1C14` | drone beetle | furniture | 320 | no | yes (80) |
| `0x1C18` | dynastid beetle | furniture | 5400 | no | yes (1350) |
| `0x1C1C` | flat stag beetle | furniture | 8000 | no | yes (2000) |
| `0x1C20` | jewel beetle | furniture | 12000 | no | yes (3000) |
| `0x1C24` | longhorn beetle | furniture | 800 | no | yes (200) |
| `0x1C28` | ladybug | furniture | 520 | no | yes (130) |
| `0x1C2C` | spotted ladybug | furniture | 800 | no | yes (200) |
| `0x1C30` | mantis | furniture | 1720 | no | yes (430) |
| `0x1C34` | firefly | furniture | 1000 | no | yes (250) |
| `0x1C38` | cockroach | furniture | 20 | no | yes (5) |
| `0x1C3C` | saw stag beetle | furniture | 8000 | no | yes (2000) |
| `0x1C40` | mountain beetle | furniture | 8000 | no | yes (2000) |
| `0x1C44` | giant beetle | furniture | 40000 | no | yes (10000) |
| `0x1C48` | snail | furniture | 1000 | no | yes (250) |
| `0x1C4C` | mole cricket | furniture | 800 | no | yes (200) |
| `0x1C50` | pond skater | furniture | 520 | no | yes (130) |
| `0x1C54` | bagworm | furniture | 1000 | no | yes (250) |
| `0x1C58` | pill bug | furniture | 1000 | no | yes (250) |
| `0x1C5C` | spider | furniture | 1200 | no | yes (300) |
| `0x1C60` | ant | furniture | 320 | no | yes (80) |
| `0x1C64` | mosquito | furniture | 520 | no | yes (130) |
| `0x1C68` | crucian carp | furniture | 480 | no | yes (120) |
| `0x1C6C` | brook trout | furniture | 600 | no | yes (150) |
| `0x1C70` | carp | furniture | 1200 | no | yes (300) |
| `0x1C74` | koi | furniture | 8000 | no | yes (2000) |
| `0x1C78` | catfish | furniture | 800 | no | yes (200) |
| `0x1C7C` | small bass | furniture | 800 | no | yes (200) |
| `0x1C80` | bass | furniture | 1200 | no | yes (300) |
| `0x1C84` | large bass | furniture | 12000 | no | yes (3000) |
| `0x1C88` | bluegill | furniture | 480 | no | yes (120) |
| `0x1C8C` | giant catfish | furniture | 12000 | no | yes (3000) |
| `0x1C90` | giant snakehead | furniture | 26000 | no | yes (6500) |
| `0x1C94` | barbel steed | furniture | 800 | no | yes (200) |
| `0x1C98` | dace | furniture | 800 | no | yes (200) |
| `0x1C9C` | pale chub | furniture | 800 | no | yes (200) |
| `0x1CA0` | bitterling | furniture | 5200 | no | yes (1300) |
| `0x1CA4` | loach | furniture | 1200 | no | yes (300) |
| `0x1CA8` | pond smelt | furniture | 1200 | no | yes (300) |
| `0x1CAC` | sweetfish | furniture | 5200 | no | yes (1300) |
| `0x1CB0` | cherry salmon | furniture | 5200 | no | yes (1300) |
| `0x1CB4` | large char | furniture | 40000 | no | yes (10000) |
| `0x1CB8` | rainbow trout | furniture | 2600 | no | yes (650) |
| `0x1CBC` | stringfish | furniture | 60000 | no | yes (15000) |
| `0x1CC0` | salmon | furniture | 2600 | no | yes (650) |
| `0x1CC4` | goldfish | furniture | 5200 | no | yes (1300) |
| `0x1CC8` | piranha | furniture | 26000 | no | yes (6500) |
| `0x1CCC` | arowana | furniture | 40000 | no | yes (10000) |
| `0x1CD0` | eel | furniture | 8000 | no | yes (2000) |
| `0x1CD4` | freshwater goby | furniture | 1200 | no | yes (300) |
| `0x1CD8` | angelfish | furniture | 12000 | no | yes (3000) |
| `0x1CDC` | guppy | furniture | 5200 | no | yes (1300) |
| `0x1CE0` | popeyed goldfish | furniture | 5200 | no | yes (1300) |
| `0x1CE4` | coelacanth | furniture | 60000 | no | yes (15000) |
| `0x1CE8` | crawfish | furniture | 1000 | no | yes (250) |
| `0x1CEC` | frog | furniture | 1000 | no | yes (250) |
| `0x1CF0` | killifish | furniture | 1200 | no | yes (300) |
| `0x1CF4` | jellyfish | furniture | 400 | no | yes (100) |
| `0x1CF8` | sea bass | furniture | 480 | no | yes (120) |
| `0x1CFC` | red snapper | furniture | 12000 | no | yes (3000) |
| `0x1D00` | barred knifejaw | furniture | 20000 | no | yes (5000) |
| `0x1D04` | arapaima | furniture | 40000 | no | yes (10000) |
| `0x1D08` | gelato umbrella | furniture | 220 | no | yes (55) |
| `0x1D0C` | daffodil parasol | furniture | 480 | no | yes (120) |
| `0x1D10` | berry umbrella | furniture | 360 | no | yes (90) |
| `0x1D14` | orange umbrella | furniture | 320 | no | yes (80) |
| `0x1D18` | mod umbrella | furniture | 290 | no | yes (72) |
| `0x1D1C` | petal parasol | furniture | 490 | no | yes (122) |
| `0x1D20` | ribbon parasol | furniture | 330 | no | yes (82) |
| `0x1D24` | gingham parasol | furniture | 290 | no | yes (72) |
| `0x1D28` | plaid parasol | furniture | 290 | no | yes (72) |
| `0x1D2C` | lacy parasol | furniture | 420 | no | yes (105) |
| `0x1D30` | elegant umbrella | furniture | 380 | no | yes (95) |
| `0x1D34` | dainty parasol | furniture | 380 | no | yes (95) |
| `0x1D38` | classic umbrella | furniture | 340 | no | yes (85) |
| `0x1D3C` | Nintendo parasol | furniture | 64 | no | yes (16) |
| `0x1D40` | bumbershoot | furniture | 420 | no | yes (105) |
| `0x1D44` | sunny parasol | furniture | 380 | no | yes (95) |
| `0x1D48` | batbrella | furniture | 190 | no | yes (47) |
| `0x1D4C` | checked umbrella | furniture | 230 | no | yes (57) |
| `0x1D50` | yellow umbrella | furniture | 240 | no | yes (60) |
| `0x1D54` | leaf umbrella | furniture | 88 | no | yes (22) |
| `0x1D58` | lotus parasol | furniture | 480 | no | yes (120) |
| `0x1D5C` | paper parasol | furniture | 350 | no | yes (87) |
| `0x1D60` | polka parasol | furniture | 340 | no | yes (85) |
| `0x1D64` | sharp umbrella | furniture | 250 | no | yes (62) |
| `0x1D68` | twig parasol | furniture | 120 | no | yes (30) |
| `0x1D6C` | noodle parasol | furniture | 490 | no | yes (122) |
| `0x1D70` | hypno parasol | furniture | 490 | no | yes (122) |
| `0x1D74` | pastel parasol | furniture | 380 | no | yes (95) |
| `0x1D78` | retro umbrella | furniture | 360 | no | yes (90) |
| `0x1D7C` | icy umbrella | furniture | 480 | no | yes (120) |
| `0x1D80` | blue umbrella | furniture | 100 | no | yes (25) |
| `0x1D84` | flame umbrella | furniture | 290 | no | yes (72) |
| `0x1D88` | my umbrella 1 | furniture | 400 | no | yes (100) |
| `0x1D8C` | my umbrella 2 | furniture | 400 | no | yes (100) |
| `0x1D90` | my umbrella 3 | furniture | 400 | no | yes (100) |
| `0x1D94` | my umbrella 4 | furniture | 400 | no | yes (100) |
| `0x1D98` | my umbrella 5 | furniture | 400 | no | yes (100) |
| `0x1D9C` | my umbrella 6 | furniture | 400 | no | yes (100) |
| `0x1DA0` | my umbrella 7 | furniture | 400 | no | yes (100) |
| `0x1DA4` | my umbrella 8 | furniture | 400 | no | yes (100) |
| `0x1DA8` | Clu Clu Land | furniture | 3000 | no | yes (750) |
| `0x1DAC` | Balloon Fight | furniture | 3000 | no | yes (750) |
| `0x1DB0` | Donkey Kong | furniture | 3000 | no | yes (750) |
| `0x1DB4` | DK Jr MATH | furniture | 3000 | no | yes (750) |
| `0x1DB8` | Pinball | furniture | 3000 | no | yes (750) |
| `0x1DBC` | Tennis | furniture | 3000 | no | yes (750) |
| `0x1DC0` | Golf | furniture | 3000 | no | yes (750) |
| `0x1DC4` | Punchout | furniture | 3000 | no | yes (750) |
| `0x1DC8` | Baseball | furniture | 3000 | no | yes (750) |
| `0x1DCC` | Clu Clu Land D | furniture | 3000 | no | yes (750) |
| `0x1DD0` | Donkey Kong 3 | furniture | 3000 | no | yes (750) |
| `0x1DD4` | Donkey Kong Jr | furniture | 3000 | no | yes (750) |
| `0x1DD8` | Soccer | furniture | 3000 | no | yes (750) |
| `0x1DDC` | Excitebike | furniture | 3000 | no | yes (750) |
| `0x1DE0` | Wario's Woods | furniture | 3000 | no | yes (750) |
| `0x1DE4` | Ice Climber | furniture | 40000 | no | yes (10000) |
| `0x1DE8` | Mario Bros | furniture | 40000 | no | yes (10000) |
| `0x1DEC` | Super Mario Bros | furniture | 40000 | no | yes (10000) |
| `0x1DF0` | Legend of Zelda | furniture | 40000 | no | yes (10000) |
| `0x1DF4` | NES | furniture | 3000 | no | yes (750) |
| `0x1DF8` | phonograph | furniture | 1840 | no | yes (460) |
| `0x1DFC` | turntable | furniture | 2580 | no | yes (645) |
| `0x1E00` | jukebox | furniture | 3850 | no | yes (962) |
| `0x1E04` | red boom box | furniture | 1500 | no | yes (375) |
| `0x1E08` | white boom box | furniture | 1500 | no | yes (375) |
| `0x1E0C` | high-end stereo | furniture | 2750 | no | yes (687) |
| `0x1E10` | hi-fi stereo | furniture | 24000 | no | yes (6000) |
| `0x1E14` | lovely stereo | furniture | 1980 | no | yes (495) |
| `0x1E18` | Jingle lamp | furniture | 48960 | no | yes (12240) |
| `0x1E1C` | Jingle chair | furniture | 48960 | no | yes (12240) |
| `0x1E20` | Jingle shelves | furniture | 48960 | no | yes (12240) |
| `0x1E24` | Jingle sofa | furniture | 48960 | no | yes (12240) |
| `0x1E28` | Jingle bed | furniture | 48960 | no | yes (12240) |
| `0x1E2C` | Jingle clock | furniture | 48960 | no | yes (12240) |
| `0x1E30` | Jingle table | furniture | 48960 | no | yes (12240) |
| `0x1E34` | Jingle piano | furniture | 48960 | no | yes (12240) |
| `0x1E38` | Aiko figurine | furniture | 800 | no | yes (200) |
| `0x1E3C` | robo-stereo | furniture | 2200 | no | yes (550) |
| `0x1E40` | dice stereo | furniture | 2150 | no | yes (537) |
| `0x1E44` | apple clock | furniture | 1200 | no | yes (300) |
| `0x1E48` | robo-clock | furniture | 1400 | no | yes (350) |
| `0x1E4C` | kitschy clock | furniture | 1800 | no | yes (450) |
| `0x1E50` | antique clock | furniture | 2350 | no | yes (587) |
| `0x1E54` | reel-to-reel | furniture | 2000 | no | yes (500) |
| `0x1E58` | tape deck | furniture | 700 | no | yes (175) |
| `0x1E5C` | CD player | furniture | 1600 | no | yes (400) |
| `0x1E60` | glow clock | furniture | 1500 | no | yes (375) |
| `0x1E64` | odd clock | furniture | 1800 | no | yes (450) |
| `0x1E68` | red clock | furniture | 1300 | no | yes (325) |
| `0x1E6C` | cube clock | furniture | 1100 | no | yes (275) |
| `0x1E70` | owl clock | furniture | 1300 | no | yes (325) |
| `0x1E74` | lucky cat | furniture | 1700 | no | yes (425) |
| `0x1E78` | lucky black cat | furniture | 1700 | no | yes (425) |
| `0x1E7C` | samurai suit | furniture | 4500 | no | yes (1125) |
| `0x1E80` | racoon obje | furniture | 2000 | no | yes (500) |
| `0x1E84` | lucky frog | furniture | 1350 | no | yes (337) |
| `0x1E88` | big festive tree | furniture | 2480 | no | yes (620) |
| `0x1E8C` | white rook | furniture | 2800 | no | yes (700) |
| `0x1E90` | black rook | furniture | 2800 | no | yes (700) |
| `0x1E94` | white queen | furniture | 23200 | no | yes (5800) |
| `0x1E98` | black queen | furniture | 23200 | no | yes (5800) |
| `0x1E9C` | white bishop | furniture | 2800 | no | yes (700) |
| `0x1EA0` | black bishop | furniture | 2800 | no | yes (700) |
| `0x1EA4` | white king | furniture | 23200 | no | yes (5800) |
| `0x1EA8` | black king | furniture | 23200 | no | yes (5800) |
| `0x1EAC` | white knight | furniture | 2800 | no | yes (700) |
| `0x1EB0` | black knight | furniture | 2800 | no | yes (700) |
| `0x1EB4` | white pawn | furniture | 1000 | no | yes (250) |
| `0x1EB8` | black pawn | furniture | 1000 | no | yes (250) |
| `0x1EBC` | festive tree | furniture | 1300 | no | yes (325) |
| `0x1EC0` | kiddie clock | furniture | 1480 | no | yes (370) |
| `0x1EC4` | kiddie bed | furniture | 2100 | no | yes (525) |
| `0x1EC8` | kiddie table | furniture | 2200 | no | yes (550) |
| `0x1ECC` | kiddie couch | furniture | 2200 | no | yes (550) |
| `0x1ED0` | kiddie stereo | furniture | 1900 | no | yes (475) |
| `0x1ED4` | kiddie chair | furniture | 1400 | no | yes (350) |
| `0x1ED8` | kiddie bookcase | furniture | 1800 | no | yes (450) |
| `0x1EDC` | alcove | furniture | 2500 | no | yes (625) |
| `0x1EE0` | hearth | furniture | 1600 | no | yes (400) |
| `0x1EE4` | chalk board | furniture | 1400 | no | yes (350) |
| `0x1EE8` | mop | furniture | 900 | no | yes (225) |
| `0x1F50` | modern lamp | furniture | 1400 | no | yes (350) |
| `0x1F54` | Snowman fridge | furniture | 35552 | no | yes (8888) |
| `0x1F58` | Snowman table | furniture | 35552 | no | yes (8888) |
| `0x1F5C` | Snowman bed | furniture | 35552 | no | yes (8888) |
| `0x1F60` | Snowman chair | furniture | 35552 | no | yes (8888) |
| `0x1F64` | Snowman lamp | furniture | 35552 | no | yes (8888) |
| `0x1F68` | Snowman sofa | furniture | 35552 | no | yes (8888) |
| `0x1F6C` | Snowman TV | furniture | 35552 | no | yes (8888) |
| `0x1F70` | Snowman dresser | furniture | 35552 | no | yes (8888) |
| `0x1F74` | Snowman wardrobe | furniture | 35552 | no | yes (8888) |
| `0x1F78` | Snowman clock | furniture | 35552 | no | yes (8888) |
| `0x1F7C` | tricera D | furniture | 0 | no | yes (0) |
| `0x1F80` | T-rex D | furniture | 0 | no | yes (0) |
| `0x1F84` | bronto D | furniture | 0 | no | yes (0) |
| `0x1F88` | ptera D | furniture | 0 | no | yes (0) |
| `0x1F8C` | HUTABAD | furniture | 0 | no | yes (0) |
| `0x1F90` | mammoth D | furniture | 0 | no | yes (0) |
| `0x1F94` | stego D | furniture | 0 | no | yes (0) |
| `0x1F98` | stego D2 | furniture | 0 | no | yes (0) |
| `0x1F9C` | fossil | furniture | 0 | no | yes (0) |
| `0x1FA0` | shogi piece | furniture | 5000 | no | yes (1250) |
| `0x1FA4` | chocolates | furniture | 2720 | no | yes (680) |
| `0x1FA8` | post box | furniture | 4000 | no | yes (1000) |
| `0x1FAC` | piggy bank | furniture | 4480 | no | yes (1120) |
| `0x1FB0` | tissue | furniture | 1280 | no | yes (320) |
| `0x1FB4` | tribal mask | furniture | 4400 | no | yes (1100) |
| `0x1FB8` | matryoshka | furniture | 3920 | no | yes (980) |
| `0x1FBC` | Legend of Zelda | furniture | 40000 | no | yes (10000) |
| `0x1FC0` | bottled ship | furniture | 3360 | no | yes (840) |
| `0x1FC4` | tiger bobblehead | furniture | 2320 | no | yes (580) |
| `0x1FC8` | Moai statue | furniture | 7600 | no | yes (1900) |
| `0x1FCC` | aerobics radio | furniture | 24000 | no | yes (6000) |
| `0x1FD0` | pagoda | furniture | 5120 | no | yes (1280) |
| `0x1FD4` | fishing bear | furniture | 2720 | no | yes (680) |
| `0x1FD8` | Mouth of Truth | furniture | 7600 | no | yes (1900) |
| `0x1FDC` | Chinese lioness | furniture | 7200 | no | yes (1800) |
| `0x1FE0` | Tower of Pisa | furniture | 9200 | no | yes (2300) |
| `0x1FE4` | Merlion | furniture | 9200 | no | yes (2300) |
| `0x1FE8` | Manekin Pis | furniture | 5200 | no | yes (1300) |
| `0x1FEC` | Tokyo Tower | furniture | 4600 | no | yes (1150) |
| `0x1FF0` | red balloon | furniture | 40 | no | yes (10) |
| `0x1FF4` | yellow balloon | furniture | 40 | no | yes (10) |
| `0x1FF8` | blue balloon | furniture | 40 | no | yes (10) |
| `0x1FFC` | green balloon | furniture | 40 | no | yes (10) |
| `0x2000` | stationery 0 | item | 40 | yes (10) | yes (10) |
| `0x2001` | stationery 1 | item | 40 | yes (10) | yes (10) |
| `0x2002` | stationery 2 | item | 40 | yes (10) | yes (10) |
| `0x2003` | stationery 3 | item | 40 | yes (10) | yes (10) |
| `0x2004` | stationery 4 | item | 40 | yes (10) | yes (10) |
| `0x2005` | stationery 5 | item | 40 | yes (10) | yes (10) |
| `0x2006` | stationery 6 | item | 40 | yes (10) | yes (10) |
| `0x2007` | stationery 7 | item | 40 | yes (10) | yes (10) |
| `0x2008` | stationery 8 | item | 40 | yes (10) | yes (10) |
| `0x2009` | stationery 9 | item | 40 | yes (10) | yes (10) |
| `0x200A` | stationery 10 | item | 40 | yes (10) | yes (10) |
| `0x200B` | stationery 11 | item | 40 | yes (10) | yes (10) |
| `0x200C` | stationery 12 | item | 40 | yes (10) | yes (10) |
| `0x200D` | stationery 13 | item | 40 | yes (10) | yes (10) |
| `0x200E` | stationery 14 | item | 40 | yes (10) | yes (10) |
| `0x200F` | stationery 15 | item | 40 | yes (10) | yes (10) |
| `0x2010` | stationery 16 | item | 40 | yes (10) | yes (10) |
| `0x2011` | stationery 17 | item | 40 | yes (10) | yes (10) |
| `0x2012` | stationery 18 | item | 40 | yes (10) | yes (10) |
| `0x2013` | stationery 19 | item | 40 | yes (10) | yes (10) |
| `0x2014` | stationery 20 | item | 40 | yes (10) | yes (10) |
| `0x2015` | stationery 21 | item | 40 | yes (10) | yes (10) |
| `0x2016` | stationery 22 | item | 0 | yes (0) | yes (0) |
| `0x2017` | stationery 23 | item | 40 | yes (10) | yes (10) |
| `0x2018` | stationery 24 | item | 40 | yes (10) | yes (10) |
| `0x2019` | stationery 25 | item | 0 | yes (0) | yes (0) |
| `0x201A` | stationery 26 | item | 40 | yes (10) | yes (10) |
| `0x201B` | stationery 27 | item | 40 | yes (10) | yes (10) |
| `0x201C` | stationery 28 | item | 40 | yes (10) | yes (10) |
| `0x201D` | stationery 29 | item | 40 | yes (10) | yes (10) |
| `0x201E` | stationery 30 | item | 40 | yes (10) | yes (10) |
| `0x201F` | stationery 31 | item | 40 | yes (10) | yes (10) |
| `0x2020` | stationery 32 | item | 40 | yes (10) | yes (10) |
| `0x2021` | stationery 33 | item | 40 | yes (10) | yes (10) |
| `0x2022` | stationery 34 | item | 40 | yes (10) | yes (10) |
| `0x2023` | stationery 35 | item | 40 | yes (10) | yes (10) |
| `0x2024` | stationery 36 | item | 40 | yes (10) | yes (10) |
| `0x2025` | stationery 37 | item | 40 | yes (10) | yes (10) |
| `0x2026` | stationery 38 | item | 40 | yes (10) | yes (10) |
| `0x2027` | stationery 39 | item | 40 | yes (10) | yes (10) |
| `0x2028` | stationery 40 | item | 40 | yes (10) | yes (10) |
| `0x2029` | stationery 41 | item | 40 | yes (10) | yes (10) |
| `0x202A` | stationery 42 | item | 40 | yes (10) | yes (10) |
| `0x202B` | stationery 43 | item | 40 | yes (10) | yes (10) |
| `0x202C` | stationery 44 | item | 40 | yes (10) | yes (10) |
| `0x202D` | stationery 45 | item | 40 | yes (10) | yes (10) |
| `0x202E` | stationery 46 | item | 40 | yes (10) | yes (10) |
| `0x202F` | stationery 47 | item | 40 | yes (10) | yes (10) |
| `0x2030` | stationery 48 | item | 40 | yes (10) | yes (10) |
| `0x2031` | stationery 49 | item | 40 | yes (10) | yes (10) |
| `0x2032` | stationery 50 | item | 40 | yes (10) | yes (10) |
| `0x2033` | stationery 51 | item | 0 | yes (0) | yes (0) |
| `0x2034` | stationery 52 | item | 40 | yes (10) | yes (10) |
| `0x2035` | stationery 53 | item | 40 | yes (10) | yes (10) |
| `0x2036` | stationery 54 | item | 40 | yes (10) | yes (10) |
| `0x2037` | stationery 55 | item | 40 | yes (10) | yes (10) |
| `0x2038` | stationery 56 | item | 40 | yes (10) | yes (10) |
| `0x2039` | stationery 57 | item | 40 | yes (10) | yes (10) |
| `0x203A` | stationery 58 | item | 40 | yes (10) | yes (10) |
| `0x203B` | stationery 59 | item | 40 | yes (10) | yes (10) |
| `0x203C` | stationery 60 | item | 40 | yes (10) | yes (10) |
| `0x203D` | stationery 61 | item | 40 | yes (10) | yes (10) |
| `0x203E` | stationery 62 | item | 0 | yes (0) | yes (0) |
| `0x203F` | stationery 63 | item | 40 | yes (10) | yes (10) |
| `0x2040` | stationery 0 (2 sheets) | item | 80 | yes (20) | yes (20) |
| `0x2041` | stationery 1 (2 sheets) | item | 80 | yes (20) | yes (20) |
| `0x2042` | stationery 2 (2 sheets) | item | 80 | yes (20) | yes (20) |
| `0x2043` | stationery 3 (2 sheets) | item | 80 | yes (20) | yes (20) |
| `0x2044` | stationery 4 (2 sheets) | item | 80 | yes (20) | yes (20) |
| `0x2045` | stationery 5 (2 sheets) | item | 80 | yes (20) | yes (20) |
| `0x2046` | stationery 6 (2 sheets) | item | 80 | yes (20) | yes (20) |
| `0x2047` | stationery 7 (2 sheets) | item | 80 | yes (20) | yes (20) |
| `0x2048` | stationery 8 (2 sheets) | item | 80 | yes (20) | yes (20) |
| `0x2049` | stationery 9 (2 sheets) | item | 80 | yes (20) | yes (20) |
| `0x204A` | stationery 10 (2 sheets) | item | 80 | yes (20) | yes (20) |
| `0x204B` | stationery 11 (2 sheets) | item | 80 | yes (20) | yes (20) |
| `0x204C` | stationery 12 (2 sheets) | item | 80 | yes (20) | yes (20) |
| `0x204D` | stationery 13 (2 sheets) | item | 80 | yes (20) | yes (20) |
| `0x204E` | stationery 14 (2 sheets) | item | 80 | yes (20) | yes (20) |
| `0x204F` | stationery 15 (2 sheets) | item | 80 | yes (20) | yes (20) |
| `0x2050` | stationery 16 (2 sheets) | item | 80 | yes (20) | yes (20) |
| `0x2051` | stationery 17 (2 sheets) | item | 80 | yes (20) | yes (20) |
| `0x2052` | stationery 18 (2 sheets) | item | 80 | yes (20) | yes (20) |
| `0x2053` | stationery 19 (2 sheets) | item | 80 | yes (20) | yes (20) |
| `0x2054` | stationery 20 (2 sheets) | item | 80 | yes (20) | yes (20) |
| `0x2055` | stationery 21 (2 sheets) | item | 80 | yes (20) | yes (20) |
| `0x2056` | stationery 22 (2 sheets) | item | 0 | yes (0) | yes (0) |
| `0x2057` | stationery 23 (2 sheets) | item | 80 | yes (20) | yes (20) |
| `0x2058` | stationery 24 (2 sheets) | item | 80 | yes (20) | yes (20) |
| `0x2059` | stationery 25 (2 sheets) | item | 0 | yes (0) | yes (0) |
| `0x205A` | stationery 26 (2 sheets) | item | 80 | yes (20) | yes (20) |
| `0x205B` | stationery 27 (2 sheets) | item | 80 | yes (20) | yes (20) |
| `0x205C` | stationery 28 (2 sheets) | item | 80 | yes (20) | yes (20) |
| `0x205D` | stationery 29 (2 sheets) | item | 80 | yes (20) | yes (20) |
| `0x205E` | stationery 30 (2 sheets) | item | 80 | yes (20) | yes (20) |
| `0x205F` | stationery 31 (2 sheets) | item | 80 | yes (20) | yes (20) |
| `0x2060` | stationery 32 (2 sheets) | item | 80 | yes (20) | yes (20) |
| `0x2061` | stationery 33 (2 sheets) | item | 80 | yes (20) | yes (20) |
| `0x2062` | stationery 34 (2 sheets) | item | 80 | yes (20) | yes (20) |
| `0x2063` | stationery 35 (2 sheets) | item | 80 | yes (20) | yes (20) |
| `0x2064` | stationery 36 (2 sheets) | item | 80 | yes (20) | yes (20) |
| `0x2065` | stationery 37 (2 sheets) | item | 80 | yes (20) | yes (20) |
| `0x2066` | stationery 38 (2 sheets) | item | 80 | yes (20) | yes (20) |
| `0x2067` | stationery 39 (2 sheets) | item | 80 | yes (20) | yes (20) |
| `0x2068` | stationery 40 (2 sheets) | item | 80 | yes (20) | yes (20) |
| `0x2069` | stationery 41 (2 sheets) | item | 80 | yes (20) | yes (20) |
| `0x206A` | stationery 42 (2 sheets) | item | 80 | yes (20) | yes (20) |
| `0x206B` | stationery 43 (2 sheets) | item | 80 | yes (20) | yes (20) |
| `0x206C` | stationery 44 (2 sheets) | item | 80 | yes (20) | yes (20) |
| `0x206D` | stationery 45 (2 sheets) | item | 80 | yes (20) | yes (20) |
| `0x206E` | stationery 46 (2 sheets) | item | 80 | yes (20) | yes (20) |
| `0x206F` | stationery 47 (2 sheets) | item | 80 | yes (20) | yes (20) |
| `0x2070` | stationery 48 (2 sheets) | item | 80 | yes (20) | yes (20) |
| `0x2071` | stationery 49 (2 sheets) | item | 80 | yes (20) | yes (20) |
| `0x2072` | stationery 50 (2 sheets) | item | 80 | yes (20) | yes (20) |
| `0x2073` | stationery 51 (2 sheets) | item | 0 | yes (0) | yes (0) |
| `0x2074` | stationery 52 (2 sheets) | item | 80 | yes (20) | yes (20) |
| `0x2075` | stationery 53 (2 sheets) | item | 80 | yes (20) | yes (20) |
| `0x2076` | stationery 54 (2 sheets) | item | 80 | yes (20) | yes (20) |
| `0x2077` | stationery 55 (2 sheets) | item | 80 | yes (20) | yes (20) |
| `0x2078` | stationery 56 (2 sheets) | item | 80 | yes (20) | yes (20) |
| `0x2079` | stationery 57 (2 sheets) | item | 80 | yes (20) | yes (20) |
| `0x207A` | stationery 58 (2 sheets) | item | 80 | yes (20) | yes (20) |
| `0x207B` | stationery 59 (2 sheets) | item | 80 | yes (20) | yes (20) |
| `0x207C` | stationery 60 (2 sheets) | item | 80 | yes (20) | yes (20) |
| `0x207D` | stationery 61 (2 sheets) | item | 80 | yes (20) | yes (20) |
| `0x207E` | stationery 62 (2 sheets) | item | 0 | yes (0) | yes (0) |
| `0x207F` | stationery 63 (2 sheets) | item | 80 | yes (20) | yes (20) |
| `0x2080` | stationery 0 (3 sheets) | item | 120 | yes (30) | yes (30) |
| `0x2081` | stationery 1 (3 sheets) | item | 120 | yes (30) | yes (30) |
| `0x2082` | stationery 2 (3 sheets) | item | 120 | yes (30) | yes (30) |
| `0x2083` | stationery 3 (3 sheets) | item | 120 | yes (30) | yes (30) |
| `0x2084` | stationery 4 (3 sheets) | item | 120 | yes (30) | yes (30) |
| `0x2085` | stationery 5 (3 sheets) | item | 120 | yes (30) | yes (30) |
| `0x2086` | stationery 6 (3 sheets) | item | 120 | yes (30) | yes (30) |
| `0x2087` | stationery 7 (3 sheets) | item | 120 | yes (30) | yes (30) |
| `0x2088` | stationery 8 (3 sheets) | item | 120 | yes (30) | yes (30) |
| `0x2089` | stationery 9 (3 sheets) | item | 120 | yes (30) | yes (30) |
| `0x208A` | stationery 10 (3 sheets) | item | 120 | yes (30) | yes (30) |
| `0x208B` | stationery 11 (3 sheets) | item | 120 | yes (30) | yes (30) |
| `0x208C` | stationery 12 (3 sheets) | item | 120 | yes (30) | yes (30) |
| `0x208D` | stationery 13 (3 sheets) | item | 120 | yes (30) | yes (30) |
| `0x208E` | stationery 14 (3 sheets) | item | 120 | yes (30) | yes (30) |
| `0x208F` | stationery 15 (3 sheets) | item | 120 | yes (30) | yes (30) |
| `0x2090` | stationery 16 (3 sheets) | item | 120 | yes (30) | yes (30) |
| `0x2091` | stationery 17 (3 sheets) | item | 120 | yes (30) | yes (30) |
| `0x2092` | stationery 18 (3 sheets) | item | 120 | yes (30) | yes (30) |
| `0x2093` | stationery 19 (3 sheets) | item | 120 | yes (30) | yes (30) |
| `0x2094` | stationery 20 (3 sheets) | item | 120 | yes (30) | yes (30) |
| `0x2095` | stationery 21 (3 sheets) | item | 120 | yes (30) | yes (30) |
| `0x2096` | stationery 22 (3 sheets) | item | 0 | yes (0) | yes (0) |
| `0x2097` | stationery 23 (3 sheets) | item | 120 | yes (30) | yes (30) |
| `0x2098` | stationery 24 (3 sheets) | item | 120 | yes (30) | yes (30) |
| `0x2099` | stationery 25 (3 sheets) | item | 0 | yes (0) | yes (0) |
| `0x209A` | stationery 26 (3 sheets) | item | 120 | yes (30) | yes (30) |
| `0x209B` | stationery 27 (3 sheets) | item | 120 | yes (30) | yes (30) |
| `0x209C` | stationery 28 (3 sheets) | item | 120 | yes (30) | yes (30) |
| `0x209D` | stationery 29 (3 sheets) | item | 120 | yes (30) | yes (30) |
| `0x209E` | stationery 30 (3 sheets) | item | 120 | yes (30) | yes (30) |
| `0x209F` | stationery 31 (3 sheets) | item | 120 | yes (30) | yes (30) |
| `0x20A0` | stationery 32 (3 sheets) | item | 120 | yes (30) | yes (30) |
| `0x20A1` | stationery 33 (3 sheets) | item | 120 | yes (30) | yes (30) |
| `0x20A2` | stationery 34 (3 sheets) | item | 120 | yes (30) | yes (30) |
| `0x20A3` | stationery 35 (3 sheets) | item | 120 | yes (30) | yes (30) |
| `0x20A4` | stationery 36 (3 sheets) | item | 120 | yes (30) | yes (30) |
| `0x20A5` | stationery 37 (3 sheets) | item | 120 | yes (30) | yes (30) |
| `0x20A6` | stationery 38 (3 sheets) | item | 120 | yes (30) | yes (30) |
| `0x20A7` | stationery 39 (3 sheets) | item | 120 | yes (30) | yes (30) |
| `0x20A8` | stationery 40 (3 sheets) | item | 120 | yes (30) | yes (30) |
| `0x20A9` | stationery 41 (3 sheets) | item | 120 | yes (30) | yes (30) |
| `0x20AA` | stationery 42 (3 sheets) | item | 120 | yes (30) | yes (30) |
| `0x20AB` | stationery 43 (3 sheets) | item | 120 | yes (30) | yes (30) |
| `0x20AC` | stationery 44 (3 sheets) | item | 120 | yes (30) | yes (30) |
| `0x20AD` | stationery 45 (3 sheets) | item | 120 | yes (30) | yes (30) |
| `0x20AE` | stationery 46 (3 sheets) | item | 120 | yes (30) | yes (30) |
| `0x20AF` | stationery 47 (3 sheets) | item | 120 | yes (30) | yes (30) |
| `0x20B0` | stationery 48 (3 sheets) | item | 120 | yes (30) | yes (30) |
| `0x20B1` | stationery 49 (3 sheets) | item | 120 | yes (30) | yes (30) |
| `0x20B2` | stationery 50 (3 sheets) | item | 120 | yes (30) | yes (30) |
| `0x20B3` | stationery 51 (3 sheets) | item | 0 | yes (0) | yes (0) |
| `0x20B4` | stationery 52 (3 sheets) | item | 120 | yes (30) | yes (30) |
| `0x20B5` | stationery 53 (3 sheets) | item | 120 | yes (30) | yes (30) |
| `0x20B6` | stationery 54 (3 sheets) | item | 120 | yes (30) | yes (30) |
| `0x20B7` | stationery 55 (3 sheets) | item | 120 | yes (30) | yes (30) |
| `0x20B8` | stationery 56 (3 sheets) | item | 120 | yes (30) | yes (30) |
| `0x20B9` | stationery 57 (3 sheets) | item | 120 | yes (30) | yes (30) |
| `0x20BA` | stationery 58 (3 sheets) | item | 120 | yes (30) | yes (30) |
| `0x20BB` | stationery 59 (3 sheets) | item | 120 | yes (30) | yes (30) |
| `0x20BC` | stationery 60 (3 sheets) | item | 120 | yes (30) | yes (30) |
| `0x20BD` | stationery 61 (3 sheets) | item | 120 | yes (30) | yes (30) |
| `0x20BE` | stationery 62 (3 sheets) | item | 0 | yes (0) | yes (0) |
| `0x20BF` | stationery 63 (3 sheets) | item | 120 | yes (30) | yes (30) |
| `0x20C0` | stationery 0 (4 sheets) | item | 160 | yes (40) | yes (40) |
| `0x20C1` | stationery 1 (4 sheets) | item | 160 | yes (40) | yes (40) |
| `0x20C2` | stationery 2 (4 sheets) | item | 160 | yes (40) | yes (40) |
| `0x20C3` | stationery 3 (4 sheets) | item | 160 | yes (40) | yes (40) |
| `0x20C4` | stationery 4 (4 sheets) | item | 160 | yes (40) | yes (40) |
| `0x20C5` | stationery 5 (4 sheets) | item | 160 | yes (40) | yes (40) |
| `0x20C6` | stationery 6 (4 sheets) | item | 160 | yes (40) | yes (40) |
| `0x20C7` | stationery 7 (4 sheets) | item | 160 | yes (40) | yes (40) |
| `0x20C8` | stationery 8 (4 sheets) | item | 160 | yes (40) | yes (40) |
| `0x20C9` | stationery 9 (4 sheets) | item | 160 | yes (40) | yes (40) |
| `0x20CA` | stationery 10 (4 sheets) | item | 160 | yes (40) | yes (40) |
| `0x20CB` | stationery 11 (4 sheets) | item | 160 | yes (40) | yes (40) |
| `0x20CC` | stationery 12 (4 sheets) | item | 160 | yes (40) | yes (40) |
| `0x20CD` | stationery 13 (4 sheets) | item | 160 | yes (40) | yes (40) |
| `0x20CE` | stationery 14 (4 sheets) | item | 160 | yes (40) | yes (40) |
| `0x20CF` | stationery 15 (4 sheets) | item | 160 | yes (40) | yes (40) |
| `0x20D0` | stationery 16 (4 sheets) | item | 160 | yes (40) | yes (40) |
| `0x20D1` | stationery 17 (4 sheets) | item | 160 | yes (40) | yes (40) |
| `0x20D2` | stationery 18 (4 sheets) | item | 160 | yes (40) | yes (40) |
| `0x20D3` | stationery 19 (4 sheets) | item | 160 | yes (40) | yes (40) |
| `0x20D4` | stationery 20 (4 sheets) | item | 160 | yes (40) | yes (40) |
| `0x20D5` | stationery 21 (4 sheets) | item | 160 | yes (40) | yes (40) |
| `0x20D6` | stationery 22 (4 sheets) | item | 0 | yes (0) | yes (0) |
| `0x20D7` | stationery 23 (4 sheets) | item | 160 | yes (40) | yes (40) |
| `0x20D8` | stationery 24 (4 sheets) | item | 160 | yes (40) | yes (40) |
| `0x20D9` | stationery 25 (4 sheets) | item | 0 | yes (0) | yes (0) |
| `0x20DA` | stationery 26 (4 sheets) | item | 160 | yes (40) | yes (40) |
| `0x20DB` | stationery 27 (4 sheets) | item | 160 | yes (40) | yes (40) |
| `0x20DC` | stationery 28 (4 sheets) | item | 160 | yes (40) | yes (40) |
| `0x20DD` | stationery 29 (4 sheets) | item | 160 | yes (40) | yes (40) |
| `0x20DE` | stationery 30 (4 sheets) | item | 160 | yes (40) | yes (40) |
| `0x20DF` | stationery 31 (4 sheets) | item | 160 | yes (40) | yes (40) |
| `0x20E0` | stationery 32 (4 sheets) | item | 160 | yes (40) | yes (40) |
| `0x20E1` | stationery 33 (4 sheets) | item | 160 | yes (40) | yes (40) |
| `0x20E2` | stationery 34 (4 sheets) | item | 160 | yes (40) | yes (40) |
| `0x20E3` | stationery 35 (4 sheets) | item | 160 | yes (40) | yes (40) |
| `0x20E4` | stationery 36 (4 sheets) | item | 160 | yes (40) | yes (40) |
| `0x20E5` | stationery 37 (4 sheets) | item | 160 | yes (40) | yes (40) |
| `0x20E6` | stationery 38 (4 sheets) | item | 160 | yes (40) | yes (40) |
| `0x20E7` | stationery 39 (4 sheets) | item | 160 | yes (40) | yes (40) |
| `0x20E8` | stationery 40 (4 sheets) | item | 160 | yes (40) | yes (40) |
| `0x20E9` | stationery 41 (4 sheets) | item | 160 | yes (40) | yes (40) |
| `0x20EA` | stationery 42 (4 sheets) | item | 160 | yes (40) | yes (40) |
| `0x20EB` | stationery 43 (4 sheets) | item | 160 | yes (40) | yes (40) |
| `0x20EC` | stationery 44 (4 sheets) | item | 160 | yes (40) | yes (40) |
| `0x20ED` | stationery 45 (4 sheets) | item | 160 | yes (40) | yes (40) |
| `0x20EE` | stationery 46 (4 sheets) | item | 160 | yes (40) | yes (40) |
| `0x20EF` | stationery 47 (4 sheets) | item | 160 | yes (40) | yes (40) |
| `0x20F0` | stationery 48 (4 sheets) | item | 160 | yes (40) | yes (40) |
| `0x20F1` | stationery 49 (4 sheets) | item | 160 | yes (40) | yes (40) |
| `0x20F2` | stationery 50 (4 sheets) | item | 160 | yes (40) | yes (40) |
| `0x20F3` | stationery 51 (4 sheets) | item | 0 | yes (0) | yes (0) |
| `0x20F4` | stationery 52 (4 sheets) | item | 160 | yes (40) | yes (40) |
| `0x20F5` | stationery 53 (4 sheets) | item | 160 | yes (40) | yes (40) |
| `0x20F6` | stationery 54 (4 sheets) | item | 160 | yes (40) | yes (40) |
| `0x20F7` | stationery 55 (4 sheets) | item | 160 | yes (40) | yes (40) |
| `0x20F8` | stationery 56 (4 sheets) | item | 160 | yes (40) | yes (40) |
| `0x20F9` | stationery 57 (4 sheets) | item | 160 | yes (40) | yes (40) |
| `0x20FA` | stationery 58 (4 sheets) | item | 160 | yes (40) | yes (40) |
| `0x20FB` | stationery 59 (4 sheets) | item | 160 | yes (40) | yes (40) |
| `0x20FC` | stationery 60 (4 sheets) | item | 160 | yes (40) | yes (40) |
| `0x20FD` | stationery 61 (4 sheets) | item | 160 | yes (40) | yes (40) |
| `0x20FE` | stationery 62 (4 sheets) | item | 0 | yes (0) | yes (0) |
| `0x20FF` | stationery 63 (4 sheets) | item | 160 | yes (40) | yes (40) |
| `0x2200` | net | item | 500 | yes (125) | yes (125) |
| `0x2201` | axe | item | 400 | yes (100) | yes (100) |
| `0x2202` | shovel | item | 500 | yes (125) | yes (125) |
| `0x2203` | fishing rod | item | 500 | yes (125) | yes (125) |
| `0x2204` | gelato umbrella | item | 220 | no | yes (55) |
| `0x2205` | daffodil parasol | item | 480 | no | yes (120) |
| `0x2206` | berry umbrella | item | 360 | no | yes (90) |
| `0x2207` | orange umbrella | item | 320 | no | yes (80) |
| `0x2208` | mod umbrella | item | 290 | no | yes (72) |
| `0x2209` | petal parasol | item | 490 | no | yes (122) |
| `0x220A` | ribbon parasol | item | 330 | no | yes (82) |
| `0x220B` | gingham parasol | item | 290 | no | yes (72) |
| `0x220C` | plaid parasol | item | 290 | no | yes (72) |
| `0x220D` | lacy parasol | item | 420 | no | yes (105) |
| `0x220E` | elegant umbrella | item | 380 | no | yes (95) |
| `0x220F` | dainty parasol | item | 380 | no | yes (95) |
| `0x2210` | classic umbrella | item | 340 | no | yes (85) |
| `0x2211` | Nintendo parasol | item | 64 | no | yes (16) |
| `0x2212` | bumbershoot | item | 420 | no | yes (105) |
| `0x2213` | sunny parasol | item | 380 | no | yes (95) |
| `0x2214` | batbrella | item | 190 | no | yes (47) |
| `0x2215` | checked umbrella | item | 230 | no | yes (57) |
| `0x2216` | yellow umbrella | item | 240 | no | yes (60) |
| `0x2217` | leaf umbrella | item | 88 | no | yes (22) |
| `0x2218` | lotus parasol | item | 480 | no | yes (120) |
| `0x2219` | paper parasol | item | 350 | no | yes (87) |
| `0x221A` | polka parasol | item | 340 | no | yes (85) |
| `0x221B` | sharp umbrella | item | 250 | no | yes (62) |
| `0x221C` | twig parasol | item | 120 | no | yes (30) |
| `0x221D` | noodle parasol | item | 490 | no | yes (122) |
| `0x221E` | hypno parasol | item | 490 | no | yes (122) |
| `0x221F` | pastel parasol | item | 380 | no | yes (95) |
| `0x2220` | retro umbrella | item | 360 | no | yes (90) |
| `0x2221` | icy umbrella | item | 480 | no | yes (120) |
| `0x2222` | blue umbrella | item | 100 | no | yes (25) |
| `0x2223` | flame umbrella | item | 290 | no | yes (72) |
| `0x2224` | my org umbrella0 | item | 0 | no | yes (0) |
| `0x2225` | my org umbrella1 | item | 0 | no | yes (0) |
| `0x2226` | my org umbrella2 | item | 0 | no | yes (0) |
| `0x2227` | my org umbrella3 | item | 0 | no | yes (0) |
| `0x2228` | my org umbrella4 | item | 0 | no | yes (0) |
| `0x2229` | my org umbrella5 | item | 0 | no | yes (0) |
| `0x222A` | my org umbrella6 | item | 0 | no | yes (0) |
| `0x222B` | my org umbrella7 | item | 0 | no | yes (0) |
| `0x222D` | red paint | item | 980 | yes (245) | yes (245) |
| `0x222E` | orange paint | item | 980 | yes (245) | yes (245) |
| `0x222F` | yellow paint | item | 980 | yes (245) | yes (245) |
| `0x2230` | pale green paint | item | 980 | yes (245) | yes (245) |
| `0x2231` | green paint | item | 980 | yes (245) | yes (245) |
| `0x2232` | sky blue paint | item | 980 | yes (245) | yes (245) |
| `0x2233` | blue paint | item | 980 | yes (245) | yes (245) |
| `0x2234` | purple paint | item | 980 | yes (245) | yes (245) |
| `0x2235` | pink paint | item | 980 | yes (245) | yes (245) |
| `0x2236` | black paint | item | 980 | yes (245) | yes (245) |
| `0x2237` | white paint | item | 980 | yes (245) | yes (245) |
| `0x2238` | brown paint | item | 980 | yes (245) | yes (245) |
| `0x2239` | golden net | item | 0 | yes (0) | yes (0) |
| `0x223A` | golden axe | item | 0 | yes (0) | yes (0) |
| `0x223B` | golden shovel | item | 0 | yes (0) | yes (0) |
| `0x223C` | golden rod | item | 0 | yes (0) | yes (0) |
| `0x223D` | axe use 1 | item | 400 | yes (100) | yes (100) |
| `0x223E` | axe use 2 | item | 400 | yes (100) | yes (100) |
| `0x223F` | axe use 3 | item | 400 | yes (100) | yes (100) |
| `0x2240` | axe use 4 | item | 400 | yes (100) | yes (100) |
| `0x2241` | axe use 5 | item | 400 | yes (100) | yes (100) |
| `0x2242` | axe use 6 | item | 400 | yes (100) | yes (100) |
| `0x2243` | axe use 7 | item | 400 | yes (100) | yes (100) |
| `0x224C` | yellow pinwheel | item | 480 | yes (120) | yes (120) |
| `0x224D` | red pinwheel | item | 480 | yes (120) | yes (120) |
| `0x224E` | tiger pinwheel | item | 480 | yes (120) | yes (120) |
| `0x224F` | green pinwheel | item | 480 | yes (120) | yes (120) |
| `0x2250` | pink pinwheel | item | 480 | yes (120) | yes (120) |
| `0x2251` | striped pinwheel | item | 480 | yes (120) | yes (120) |
| `0x2252` | flower pinwheel | item | 800 | yes (200) | yes (200) |
| `0x2253` | fancy pinwheel | item | 800 | yes (200) | yes (200) |
| `0x2254` | bluebell fan | item | 600 | yes (150) | yes (150) |
| `0x2255` | plum fan | item | 600 | yes (150) | yes (150) |
| `0x2256` | bamboo fan | item | 600 | yes (150) | yes (150) |
| `0x2257` | cloud fan | item | 600 | yes (150) | yes (150) |
| `0x2258` | maple fan | item | 600 | yes (150) | yes (150) |
| `0x2259` | fan fan | item | 800 | yes (200) | yes (200) |
| `0x225A` | flower fan | item | 1000 | yes (250) | yes (250) |
| `0x225B` | leaf fan | item | 520 | yes (130) | yes (130) |
| `0x2300` | crucian carp | item | 480 | yes (120) | no |
| `0x2301` | brook trout | item | 600 | yes (150) | no |
| `0x2302` | carp | item | 1200 | yes (300) | no |
| `0x2303` | koi | item | 8000 | yes (2000) | no |
| `0x2304` | catfish | item | 800 | yes (200) | no |
| `0x2305` | small bass | item | 800 | yes (200) | no |
| `0x2306` | bass | item | 1200 | yes (300) | no |
| `0x2307` | large bass | item | 12000 | yes (3000) | no |
| `0x2308` | bluegill | item | 480 | yes (120) | no |
| `0x2309` | giant catfish | item | 12000 | yes (3000) | no |
| `0x230A` | giant snakehead | item | 26000 | yes (6500) | no |
| `0x230B` | barbel steed | item | 800 | yes (200) | no |
| `0x230C` | dace | item | 800 | yes (200) | no |
| `0x230D` | pale chub | item | 800 | yes (200) | no |
| `0x230E` | bitterling | item | 5200 | yes (1300) | no |
| `0x230F` | loach | item | 1200 | yes (300) | no |
| `0x2310` | pond smelt | item | 1200 | yes (300) | no |
| `0x2311` | sweetfish | item | 5200 | yes (1300) | no |
| `0x2312` | cherry salmon | item | 5200 | yes (1300) | no |
| `0x2313` | large char | item | 40000 | yes (10000) | no |
| `0x2314` | rainbow trout | item | 2600 | yes (650) | no |
| `0x2315` | stringfish | item | 60000 | yes (15000) | no |
| `0x2316` | salmon | item | 2600 | yes (650) | no |
| `0x2317` | goldfish | item | 5200 | yes (1300) | no |
| `0x2318` | piranha | item | 26000 | yes (6500) | no |
| `0x2319` | arowana | item | 40000 | yes (10000) | no |
| `0x231A` | eel | item | 8000 | yes (2000) | no |
| `0x231B` | freshwater goby | item | 1200 | yes (300) | no |
| `0x231C` | angelfish | item | 12000 | yes (3000) | no |
| `0x231D` | guppy | item | 5200 | yes (1300) | no |
| `0x231E` | popeyed goldfish | item | 5200 | yes (1300) | no |
| `0x231F` | coelacanth | item | 60000 | yes (15000) | no |
| `0x2320` | crawfish | item | 1000 | yes (250) | no |
| `0x2321` | frog | item | 1000 | yes (250) | no |
| `0x2322` | killifish | item | 1200 | yes (300) | no |
| `0x2323` | jellyfish | item | 400 | yes (100) | no |
| `0x2324` | sea bass | item | 480 | yes (120) | no |
| `0x2325` | red snapper | item | 12000 | yes (3000) | no |
| `0x2326` | barred knifejaw | item | 20000 | yes (5000) | no |
| `0x2327` | arapaima | item | 40000 | yes (10000) | no |
| `0x2400` | flame shirt | item | 360 | yes (90) | yes (90) |
| `0x2401` | paw shirt | item | 360 | yes (90) | yes (90) |
| `0x2402` | wavy pink shirt | item | 360 | yes (90) | yes (90) |
| `0x2403` | future shirt | item | 390 | yes (97) | yes (97) |
| `0x2404` | bold check shirt | item | 360 | yes (90) | yes (90) |
| `0x2405` | mint gingham | item | 330 | yes (82) | yes (82) |
| `0x2406` | bad plaid shirt | item | 420 | yes (105) | yes (105) |
| `0x2407` | speedway shirt | item | 290 | yes (72) | yes (72) |
| `0x2408` | folk shirt | item | 380 | yes (95) | yes (95) |
| `0x2409` | daisy shirt | item | 380 | yes (95) | yes (95) |
| `0x240A` | wavy tan shirt | item | 360 | yes (90) | yes (90) |
| `0x240B` | optical shirt | item | 430 | yes (107) | yes (107) |
| `0x240C` | rugby shirt | item | 360 | yes (90) | yes (90) |
| `0x240D` | sherbet gingham | item | 330 | yes (82) | yes (82) |
| `0x240E` | yellow tartan | item | 430 | yes (107) | yes (107) |
| `0x240F` | gelato shirt | item | 330 | yes (82) | yes (82) |
| `0x2410` | work uniform | item | 0 | yes (0) | yes (0) |
| `0x2411` | patched shirt | item | 0 | yes (0) | yes (0) |
| `0x2412` | plum kimono | item | 0 | yes (0) | yes (0) |
| `0x2413` | somber robe | item | 0 | yes (0) | yes (0) |
| `0x2414` | red sweatsuit | item | 0 | yes (0) | yes (0) |
| `0x2415` | blue sweatsuit | item | 0 | yes (0) | yes (0) |
| `0x2416` | red puffy vest | item | 0 | yes (0) | yes (0) |
| `0x2417` | blue puffy vest | item | 0 | yes (0) | yes (0) |
| `0x2418` | summer robe | item | 0 | yes (0) | yes (0) |
| `0x2419` | bamboo robe | item | 0 | yes (0) | yes (0) |
| `0x241A` | red aloha shirt | item | 0 | yes (0) | yes (0) |
| `0x241B` | blue aloha shirt | item | 0 | yes (0) | yes (0) |
| `0x241C` | dark polka shirt | item | 350 | yes (87) | yes (87) |
| `0x241D` | lite polka shirt | item | 380 | yes (95) | yes (95) |
| `0x241E` | lovely shirt | item | 400 | yes (100) | yes (100) |
| `0x241F` | citrus shirt | item | 6400 | yes (1600) | yes (1600) |
| `0x2420` | kiwi shirt | item | 6400 | yes (1600) | yes (1600) |
| `0x2421` | watermelon shirt | item | 6400 | yes (1600) | yes (1600) |
| `0x2422` | strawberry shirt | item | 6400 | yes (1600) | yes (1600) |
| `0x2423` | grape shirt | item | 6400 | yes (1600) | yes (1600) |
| `0x2424` | melon shirt | item | 6400 | yes (1600) | yes (1600) |
| `0x2425` | Jingle shirt | item | 0 | yes (0) | yes (0) |
| `0x2426` | blossom shirt | item | 370 | yes (92) | yes (92) |
| `0x2427` | icy shirt | item | 390 | yes (97) | yes (97) |
| `0x2428` | crewel shirt | item | 380 | yes (95) | yes (95) |
| `0x2429` | tropical shirt | item | 370 | yes (92) | yes (92) |
| `0x242A` | ribbon shirt | item | 370 | yes (92) | yes (92) |
| `0x242B` | fall plaid shirt | item | 370 | yes (92) | yes (92) |
| `0x242C` | fiendish shirt | item | 6800 | yes (1700) | yes (1700) |
| `0x242D` | chevron shirt | item | 320 | yes (80) | yes (80) |
| `0x242E` | ladybug shirt | item | 5400 | yes (1350) | yes (1350) |
| `0x242F` | botanical shirt | item | 420 | yes (105) | yes (105) |
| `0x2430` | Anju's shirt | item | 460 | yes (115) | yes (115) |
| `0x2431` | Kaffe's shirt | item | 460 | yes (115) | yes (115) |
| `0x2432` | lavender robe | item | 5800 | yes (1450) | yes (1450) |
| `0x2433` | blue grid shirt | item | 340 | yes (85) | yes (85) |
| `0x2434` | butterfly shirt | item | 7200 | yes (1800) | yes (1800) |
| `0x2435` | blue tartan | item | 390 | yes (97) | yes (97) |
| `0x2436` | Gracie's top | item | 6200 | yes (1550) | yes (1550) |
| `0x2437` | orange tie-dye | item | 380 | yes (95) | yes (95) |
| `0x2438` | purple tie-dye | item | 380 | yes (95) | yes (95) |
| `0x2439` | green tie-dye | item | 380 | yes (95) | yes (95) |
| `0x243A` | blue tie-dye | item | 380 | yes (95) | yes (95) |
| `0x243B` | red tie-dye | item | 380 | yes (95) | yes (95) |
| `0x243C` | one-ball shirt | item | 340 | yes (85) | yes (85) |
| `0x243D` | two-ball shirt | item | 340 | yes (85) | yes (85) |
| `0x243E` | three-ball shirt | item | 340 | yes (85) | yes (85) |
| `0x243F` | four-ball shirt | item | 340 | yes (85) | yes (85) |
| `0x2440` | five-ball shirt | item | 340 | yes (85) | yes (85) |
| `0x2441` | six-ball shirt | item | 340 | yes (85) | yes (85) |
| `0x2442` | seven-ball shirt | item | 340 | yes (85) | yes (85) |
| `0x2443` | eight-ball shirt | item | 340 | yes (85) | yes (85) |
| `0x2444` | nine-ball shirt | item | 340 | yes (85) | yes (85) |
| `0x2445` | arctic camo | item | 320 | yes (80) | yes (80) |
| `0x2446` | jungle camo | item | 320 | yes (80) | yes (80) |
| `0x2447` | desert camo | item | 320 | yes (80) | yes (80) |
| `0x2448` | rally shirt | item | 380 | yes (95) | yes (95) |
| `0x2449` | racer shirt | item | 380 | yes (95) | yes (95) |
| `0x244A` | racer 6 shirt | item | 380 | yes (95) | yes (95) |
| `0x244B` | fish bone shirt | item | 340 | yes (85) | yes (85) |
| `0x244C` | spiderweb shirt | item | 320 | yes (80) | yes (80) |
| `0x244D` | zipper shirt | item | 320 | yes (80) | yes (80) |
| `0x244E` | bubble shirt | item | 410 | yes (102) | yes (102) |
| `0x244F` | yellow bolero | item | 430 | yes (107) | yes (107) |
| `0x2450` | nebula shirt | item | 390 | yes (97) | yes (97) |
| `0x2451` | neo-classic knit | item | 380 | yes (95) | yes (95) |
| `0x2452` | noble shirt | item | 380 | yes (95) | yes (95) |
| `0x2453` | turnip top | item | 350 | yes (87) | yes (87) |
| `0x2454` | oft-seen print | item | 320 | yes (80) | yes (80) |
| `0x2455` | ski sweater | item | 320 | yes (80) | yes (80) |
| `0x2456` | circus shirt | item | 370 | yes (92) | yes (92) |
| `0x2457` | patchwork top | item | 340 | yes (85) | yes (85) |
| `0x2458` | mod top | item | 340 | yes (85) | yes (85) |
| `0x2459` | hippie shirt | item | 360 | yes (90) | yes (90) |
| `0x245A` | rickrack shirt | item | 360 | yes (90) | yes (90) |
| `0x245B` | diner uniform | item | 290 | yes (72) | yes (72) |
| `0x245C` | shirt circuit | item | 5120 | yes (1280) | yes (1280) |
| `0x245D` | U R here shirt | item | 350 | yes (87) | yes (87) |
| `0x245E` | yodel shirt | item | 350 | yes (87) | yes (87) |
| `0x245F` | pulse shirt | item | 6000 | yes (1500) | yes (1500) |
| `0x2460` | prism shirt | item | 370 | yes (92) | yes (92) |
| `0x2461` | star shirt | item | 370 | yes (92) | yes (92) |
| `0x2462` | straw shirt | item | 360 | yes (90) | yes (90) |
| `0x2463` | noodle shirt | item | 380 | yes (95) | yes (95) |
| `0x2464` | dice shirt | item | 340 | yes (85) | yes (85) |
| `0x2465` | kiddie shirt | item | 340 | yes (85) | yes (85) |
| `0x2466` | frog shirt | item | 340 | yes (85) | yes (85) |
| `0x2467` | moody blue shirt | item | 123 | yes (30) | yes (30) |
| `0x2468` | cloudy shirt | item | 320 | yes (80) | yes (80) |
| `0x2469` | fortune shirt | item | 480 | yes (120) | yes (120) |
| `0x246A` | skull shirt | item | 320 | yes (80) | yes (80) |
| `0x246B` | desert shirt | item | 390 | yes (97) | yes (97) |
| `0x246C` | aurora knit | item | 380 | yes (95) | yes (95) |
| `0x246D` | winter sweater | item | 290 | yes (72) | yes (72) |
| `0x246E` | go-go shirt | item | 360 | yes (90) | yes (90) |
| `0x246F` | jade check print | item | 360 | yes (90) | yes (90) |
| `0x2470` | blue check print | item | 360 | yes (90) | yes (90) |
| `0x2471` | red grid shirt | item | 360 | yes (90) | yes (90) |
| `0x2472` | flicker shirt | item | 360 | yes (90) | yes (90) |
| `0x2473` | floral knit | item | 420 | yes (105) | yes (105) |
| `0x2474` | rose shirt | item | 480 | yes (120) | yes (120) |
| `0x2475` | sunset top | item | 290 | yes (72) | yes (72) |
| `0x2476` | chain-gang shirt | item | 260 | yes (65) | yes (65) |
| `0x2477` | spring shirt | item | 320 | yes (80) | yes (80) |
| `0x2478` | bear shirt | item | 390 | yes (97) | yes (97) |
| `0x2479` | MVP shirt | item | 370 | yes (92) | yes (92) |
| `0x247A` | silk bloom shirt | item | 480 | yes (120) | yes (120) |
| `0x247B` | pop bloom shirt | item | 360 | yes (90) | yes (90) |
| `0x247C` | loud bloom shirt | item | 360 | yes (90) | yes (90) |
| `0x247D` | hot spring shirt | item | 520 | yes (130) | yes (130) |
| `0x247E` | new spring shirt | item | 520 | yes (130) | yes (130) |
| `0x247F` | deep blue tee | item | 380 | yes (95) | yes (95) |
| `0x2480` | snowcone shirt | item | 420 | yes (105) | yes (105) |
| `0x2481` | ugly shirt | item | 420 | yes (105) | yes (105) |
| `0x2482` | sharp outfit | item | 290 | yes (72) | yes (72) |
| `0x2483` | painter's smock | item | 360 | yes (90) | yes (90) |
| `0x2484` | spade shirt | item | 340 | yes (85) | yes (85) |
| `0x2485` | blossoming shirt | item | 390 | yes (97) | yes (97) |
| `0x2486` | peachy shirt | item | 390 | yes (97) | yes (97) |
| `0x2487` | static shirt | item | 360 | yes (90) | yes (90) |
| `0x2488` | rainbow shirt | item | 777 | yes (194) | yes (194) |
| `0x2489` | groovy shirt | item | 6400 | yes (1600) | yes (1600) |
| `0x248A` | loud line shirt | item | 370 | yes (92) | yes (92) |
| `0x248B` | dazed shirt | item | 350 | yes (87) | yes (87) |
| `0x248C` | red bar shirt | item | 360 | yes (90) | yes (90) |
| `0x248D` | blue stripe knit | item | 340 | yes (85) | yes (85) |
| `0x248E` | earthy knit | item | 390 | yes (97) | yes (97) |
| `0x248F` | spunky knit | item | 360 | yes (90) | yes (90) |
| `0x2490` | deer shirt | item | 380 | yes (95) | yes (95) |
| `0x2491` | blue check shirt | item | 380 | yes (95) | yes (95) |
| `0x2492` | light line shirt | item | 380 | yes (95) | yes (95) |
| `0x2493` | blue pinstripe | item | 380 | yes (95) | yes (95) |
| `0x2494` | diamond shirt | item | 380 | yes (95) | yes (95) |
| `0x2495` | lime line shirt | item | 380 | yes (95) | yes (95) |
| `0x2496` | big bro's shirt | item | 320 | yes (80) | yes (80) |
| `0x2497` | green bar shirt | item | 320 | yes (80) | yes (80) |
| `0x2498` | yellow bar shirt | item | 320 | yes (80) | yes (80) |
| `0x2499` | monkey shirt | item | 380 | yes (95) | yes (95) |
| `0x249A` | polar fleece | item | 360 | yes (90) | yes (90) |
| `0x249B` | ancient knit | item | 390 | yes (97) | yes (97) |
| `0x249C` | fish knit | item | 380 | yes (95) | yes (95) |
| `0x249D` | vertigo shirt | item | 370 | yes (92) | yes (92) |
| `0x249E` | misty shirt | item | 380 | yes (95) | yes (95) |
| `0x249F` | stormy shirt | item | 380 | yes (95) | yes (95) |
| `0x24A0` | red scale shirt | item | 370 | yes (92) | yes (92) |
| `0x24A1` | blue scale shirt | item | 370 | yes (92) | yes (92) |
| `0x24A2` | heart shirt | item | 360 | yes (90) | yes (90) |
| `0x24A3` | yellow pinstripe | item | 360 | yes (90) | yes (90) |
| `0x24A4` | club shirt | item | 360 | yes (90) | yes (90) |
| `0x24A5` | li'l bro's shirt | item | 320 | yes (80) | yes (80) |
| `0x24A6` | argyle knit | item | 460 | yes (115) | yes (115) |
| `0x24A7` | caveman tunic | item | 380 | yes (95) | yes (95) |
| `0x24A8` | caf\| shirt | item | 420 | yes (105) | yes (105) |
| `0x24A9` | tiki shirt | item | 400 | yes (100) | yes (100) |
| `0x24AA` | A shirt | item | 370 | yes (92) | yes (92) |
| `0x24AB` | checkered shirt | item | 390 | yes (97) | yes (97) |
| `0x24AC` | No.1 shirt | item | 250 | yes (62) | yes (62) |
| `0x24AD` | No.2 shirt | item | 250 | yes (62) | yes (62) |
| `0x24AE` | No.3 shirt | item | 250 | yes (62) | yes (62) |
| `0x24AF` | No.4 shirt | item | 250 | yes (62) | yes (62) |
| `0x24B0` | No.5 shirt | item | 250 | yes (62) | yes (62) |
| `0x24B1` | No.23 shirt | item | 250 | yes (62) | yes (62) |
| `0x24B2` | No.67 shirt | item | 250 | yes (62) | yes (62) |
| `0x24B3` | BB shirt | item | 350 | yes (87) | yes (87) |
| `0x24B4` | beatnik shirt | item | 360 | yes (90) | yes (90) |
| `0x24B5` | moldy shirt | item | 50 | yes (12) | yes (12) |
| `0x24B6` | houndstooth tee | item | 350 | yes (87) | yes (87) |
| `0x24B7` | big star shirt | item | 400 | yes (100) | yes (100) |
| `0x24B8` | orange pinstripe | item | 5000 | yes (1250) | yes (1250) |
| `0x24B9` | twinkle shirt | item | 480 | yes (120) | yes (120) |
| `0x24BA` | funky dot shirt | item | 430 | yes (107) | yes (107) |
| `0x24BB` | crossing shirt | item | 6200 | yes (1550) | yes (1550) |
| `0x24BC` | splendid shirt | item | 6200 | yes (1550) | yes (1550) |
| `0x24BD` | jagged shirt | item | 360 | yes (90) | yes (90) |
| `0x24BE` | denim shirt | item | 390 | yes (97) | yes (97) |
| `0x24BF` | cherry shirt | item | 380 | yes (95) | yes (95) |
| `0x24C0` | gumdrop shirt | item | 390 | yes (97) | yes (97) |
| `0x24C1` | barber shirt | item | 380 | yes (95) | yes (95) |
| `0x24C2` | concierge shirt | item | 350 | yes (87) | yes (87) |
| `0x24C3` | fresh shirt | item | 380 | yes (95) | yes (95) |
| `0x24C4` | far-out shirt | item | 380 | yes (95) | yes (95) |
| `0x24C5` | dawn shirt | item | 380 | yes (95) | yes (95) |
| `0x24C6` | striking outfit | item | 460 | yes (115) | yes (115) |
| `0x24C7` | red check shirt | item | 330 | yes (82) | yes (82) |
| `0x24C8` | berry gingham | item | 330 | yes (82) | yes (82) |
| `0x24C9` | lemon gingham | item | 330 | yes (82) | yes (82) |
| `0x24CA` | dragon suit | item | 340 | yes (85) | yes (85) |
| `0x24CB` | G logo shirt | item | 128 | yes (32) | yes (32) |
| `0x24CC` | tin shirt | item | 6400 | yes (1600) | yes (1600) |
| `0x24CD` | jester shirt | item | 420 | yes (105) | yes (105) |
| `0x24CE` | pink tartan | item | 420 | yes (105) | yes (105) |
| `0x24CF` | waffle shirt | item | 430 | yes (107) | yes (107) |
| `0x24D0` | gray tartan | item | 420 | yes (105) | yes (105) |
| `0x24D1` | windsock shirt | item | 320 | yes (80) | yes (80) |
| `0x24D2` | trendy top | item | 360 | yes (90) | yes (90) |
| `0x24D3` | green ring shirt | item | 180 | yes (45) | yes (45) |
| `0x24D4` | white ring shirt | item | 180 | yes (45) | yes (45) |
| `0x24D5` | snappy print | item | 320 | yes (80) | yes (80) |
| `0x24D6` | chichi print | item | 180 | yes (45) | yes (45) |
| `0x24D7` | wave print | item | 380 | yes (95) | yes (95) |
| `0x24D8` | checkerboard tee | item | 340 | yes (85) | yes (85) |
| `0x24D9` | subdued print | item | 320 | yes (80) | yes (80) |
| `0x24DA` | airy shirt | item | 420 | yes (105) | yes (105) |
| `0x24DB` | coral shirt | item | 6200 | yes (1550) | yes (1550) |
| `0x24DC` | leather jerkin | item | 390 | yes (97) | yes (97) |
| `0x24DD` | zebra print | item | 6400 | yes (1600) | yes (1600) |
| `0x24DE` | tiger print | item | 6400 | yes (1600) | yes (1600) |
| `0x24DF` | cow print | item | 6400 | yes (1600) | yes (1600) |
| `0x24E0` | leopard print | item | 6400 | yes (1600) | yes (1600) |
| `0x24E1` | danger shirt | item | 340 | yes (85) | yes (85) |
| `0x24E2` | big dot shirt | item | 340 | yes (85) | yes (85) |
| `0x24E3` | puzzling shirt | item | 320 | yes (80) | yes (80) |
| `0x24E4` | exotic shirt | item | 380 | yes (95) | yes (95) |
| `0x24E5` | houndstooth knit | item | 370 | yes (92) | yes (92) |
| `0x24E6` | uncommon shirt | item | 360 | yes (90) | yes (90) |
| `0x24E7` | dapper shirt | item | 350 | yes (87) | yes (87) |
| `0x24E8` | gaudy sweater | item | 330 | yes (82) | yes (82) |
| `0x24E9` | cozy sweater | item | 350 | yes (87) | yes (87) |
| `0x24EA` | comfy sweater | item | 360 | yes (90) | yes (90) |
| `0x24EB` | classic top | item | 350 | yes (87) | yes (87) |
| `0x24EC` | vogue top | item | 380 | yes (95) | yes (95) |
| `0x24ED` | laced shirt | item | 370 | yes (92) | yes (92) |
| `0x24EE` | natty shirt | item | 380 | yes (95) | yes (95) |
| `0x24EF` | citrus gingham | item | 360 | yes (90) | yes (90) |
| `0x24F0` | cool shirt | item | 6400 | yes (1600) | yes (1600) |
| `0x24F1` | dreamy shirt | item | 390 | yes (97) | yes (97) |
| `0x24F2` | flowery shirt | item | 400 | yes (100) | yes (100) |
| `0x24F3` | caterpillar tee | item | 6800 | yes (1700) | yes (1700) |
| `0x24F4` | shortcake shirt | item | 330 | yes (82) | yes (82) |
| `0x24F5` | whirly shirt | item | 350 | yes (87) | yes (87) |
| `0x24F6` | thunder shirt | item | 320 | yes (80) | yes (80) |
| `0x24F7` | giraffe print | item | 6200 | yes (1550) | yes (1550) |
| `0x24F8` | swell shirt | item | 6000 | yes (1500) | yes (1500) |
| `0x24F9` | toad print | item | 340 | yes (85) | yes (85) |
| `0x24FA` | grass shirt | item | 5800 | yes (1450) | yes (1450) |
| `0x24FB` | mosaic shirt | item | 350 | yes (87) | yes (87) |
| `0x24FC` | fetching outfit | item | 420 | yes (105) | yes (105) |
| `0x24FD` | snow shirt | item | 6800 | yes (1700) | yes (1700) |
| `0x24FE` | melon gingham | item | 330 | yes (82) | yes (82) |
| `0x250E` | dust0 empty can | item | 0 | yes (0) | no |
| `0x250F` | dust1 boot | item | 0 | yes (0) | no |
| `0x2510` | dust2 old tire | item | 0 | yes (0) | no |
| `0x2512` | pitfall | item | 0 | yes (0) | no |
| `0x2514` | shell0 | item | 160 | yes (40) | no |
| `0x2515` | shell1 | item | 80 | yes (20) | no |
| `0x2516` | shell2 | item | 600 | yes (150) | no |
| `0x2517` | shell3 | item | 120 | yes (30) | no |
| `0x2518` | shell4 | item | 240 | yes (60) | no |
| `0x2519` | shell5 | item | 1800 | yes (450) | no |
| `0x251A` | shell6 | item | 1400 | yes (350) | no |
| `0x251B` | shell7 | item | 1000 | yes (250) | no |
| `0x251E` | signboard | item | 500 | yes (125) | no |
| `0x2600` | carpet 0 | item | 2160 | yes (540) | yes (540) |
| `0x2601` | carpet 1 | item | 2300 | yes (575) | yes (575) |
| `0x2602` | carpet 2 | item | 1680 | yes (420) | yes (420) |
| `0x2603` | carpet 3 | item | 800 | yes (200) | yes (200) |
| `0x2604` | carpet 4 | item | 1680 | yes (420) | yes (420) |
| `0x2605` | carpet 5 | item | 800 | yes (200) | yes (200) |
| `0x2606` | carpet 6 | item | 6000 | yes (1500) | yes (1500) |
| `0x2607` | carpet 7 | item | 1980 | yes (495) | yes (495) |
| `0x2608` | carpet 8 | item | 1820 | yes (455) | yes (455) |
| `0x2609` | carpet 9 | item | 8000 | yes (2000) | yes (2000) |
| `0x260A` | carpet 10 | item | 1150 | yes (287) | yes (287) |
| `0x260B` | carpet 11 | item | 800 | yes (200) | yes (200) |
| `0x260C` | carpet 12 | item | 1330 | yes (332) | yes (332) |
| `0x260D` | carpet 13 | item | 1540 | yes (385) | yes (385) |
| `0x260E` | carpet 14 | item | 6500 | yes (1625) | yes (1625) |
| `0x260F` | carpet 15 | item | 8000 | yes (2000) | yes (2000) |
| `0x2610` | carpet 16 | item | 7000 | yes (1750) | yes (1750) |
| `0x2611` | carpet 17 | item | 41240 | yes (10310) | yes (10310) |
| `0x2612` | carpet 18 | item | 6800 | yes (1700) | yes (1700) |
| `0x2613` | carpet 19 | item | 1540 | yes (385) | yes (385) |
| `0x2614` | carpet 20 | item | 1580 | yes (395) | yes (395) |
| `0x2615` | carpet 21 | item | 2850 | yes (712) | yes (712) |
| `0x2616` | carpet 22 | item | 1750 | yes (437) | yes (437) |
| `0x2617` | carpet 23 | item | 1540 | yes (385) | yes (385) |
| `0x2618` | carpet 24 | item | 1680 | yes (420) | yes (420) |
| `0x2619` | carpet 25 | item | 35552 | yes (8888) | yes (8888) |
| `0x261A` | carpet 26 | item | 880 | yes (220) | yes (220) |
| `0x261B` | carpet 27 | item | 7200 | yes (1800) | yes (1800) |
| `0x261C` | carpet 28 | item | 2180 | yes (545) | yes (545) |
| `0x261D` | carpet 29 | item | 1890 | yes (472) | yes (472) |
| `0x261E` | carpet 30 | item | 2100 | yes (525) | yes (525) |
| `0x261F` | carpet 31 | item | 1340 | yes (335) | yes (335) |
| `0x2620` | carpet 32 | item | 1360 | yes (340) | yes (340) |
| `0x2621` | carpet 33 | item | 1230 | yes (307) | yes (307) |
| `0x2622` | carpet 34 | item | 800 | yes (200) | yes (200) |
| `0x2623` | carpet 35 | item | 2750 | yes (687) | yes (687) |
| `0x2624` | carpet 36 | item | 2980 | yes (745) | yes (745) |
| `0x2625` | carpet 37 | item | 1230 | yes (307) | yes (307) |
| `0x2626` | carpet 38 | item | 1380 | yes (345) | yes (345) |
| `0x2627` | carpet 39 | item | 1390 | yes (347) | yes (347) |
| `0x2628` | carpet 40 | item | 2980 | yes (745) | yes (745) |
| `0x2629` | carpet 41 | item | 1540 | yes (385) | yes (385) |
| `0x262A` | carpet 42 | item | 1480 | yes (370) | yes (370) |
| `0x262B` | carpet 43 | item | 6800 | yes (1700) | yes (1700) |
| `0x262C` | carpet 44 | item | 9600 | yes (2400) | yes (2400) |
| `0x262D` | carpet 45 | item | 1960 | yes (490) | yes (490) |
| `0x262E` | carpet 46 | item | 6800 | yes (1700) | yes (1700) |
| `0x262F` | carpet 47 | item | 48960 | yes (12240) | yes (12240) |
| `0x2630` | carpet 48 | item | 7200 | yes (1800) | yes (1800) |
| `0x2631` | carpet 49 | item | 7800 | yes (1950) | yes (1950) |
| `0x2632` | carpet 50 | item | 2300 | yes (575) | yes (575) |
| `0x2633` | carpet 51 | item | 2350 | yes (587) | yes (587) |
| `0x2634` | carpet 52 | item | 8500 | yes (2125) | yes (2125) |
| `0x2635` | carpet 53 | item | 8300 | yes (2075) | yes (2075) |
| `0x2636` | carpet 54 | item | 1630 | yes (407) | yes (407) |
| `0x2637` | carpet 55 | item | 720 | yes (180) | yes (180) |
| `0x2638` | carpet 56 | item | 7200 | yes (1800) | yes (1800) |
| `0x2639` | carpet 57 | item | 7200 | yes (1800) | yes (1800) |
| `0x263A` | carpet 58 | item | 1820 | yes (455) | yes (455) |
| `0x263B` | carpet 59 | item | 3200 | yes (800) | yes (800) |
| `0x263C` | carpet 60 | item | 8200 | yes (2050) | yes (2050) |
| `0x263D` | carpet 61 | item | 1360 | yes (340) | yes (340) |
| `0x263E` | carpet 62 | item | 1280 | yes (320) | yes (320) |
| `0x263F` | carpet 63 | item | 1300 | yes (325) | yes (325) |
| `0x2640` | carpet 64 | item | 8000 | yes (2000) | yes (2000) |
| `0x2641` | carpet 65 | item | 10000 | yes (2500) | yes (2500) |
| `0x2642` | carpet 66 | item | 4800 | yes (1200) | yes (1200) |
| `0x2700` | wallpaper 0 | item | 1960 | yes (490) | yes (490) |
| `0x2701` | wallpaper 1 | item | 2100 | yes (525) | yes (525) |
| `0x2702` | wallpaper 2 | item | 1120 | yes (280) | yes (280) |
| `0x2703` | wallpaper 3 | item | 800 | yes (200) | yes (200) |
| `0x2704` | wallpaper 4 | item | 1420 | yes (355) | yes (355) |
| `0x2705` | wallpaper 5 | item | 880 | yes (220) | yes (220) |
| `0x2706` | wallpaper 6 | item | 6000 | yes (1500) | yes (1500) |
| `0x2707` | wallpaper 7 | item | 1880 | yes (470) | yes (470) |
| `0x2708` | wallpaper 8 | item | 1420 | yes (355) | yes (355) |
| `0x2709` | wallpaper 9 | item | 7000 | yes (1750) | yes (1750) |
| `0x270A` | wallpaper 10 | item | 2180 | yes (545) | yes (545) |
| `0x270B` | wallpaper 11 | item | 1750 | yes (437) | yes (437) |
| `0x270C` | wallpaper 12 | item | 1120 | yes (280) | yes (280) |
| `0x270D` | wallpaper 13 | item | 1200 | yes (300) | yes (300) |
| `0x270E` | wallpaper 14 | item | 5600 | yes (1400) | yes (1400) |
| `0x270F` | wallpaper 15 | item | 7600 | yes (1900) | yes (1900) |
| `0x2710` | wallpaper 16 | item | 6400 | yes (1600) | yes (1600) |
| `0x2711` | wallpaper 17 | item | 41240 | yes (10310) | yes (10310) |
| `0x2712` | wallpaper 18 | item | 6000 | yes (1500) | yes (1500) |
| `0x2713` | wallpaper 19 | item | 1050 | yes (262) | yes (262) |
| `0x2714` | wallpaper 20 | item | 1260 | yes (315) | yes (315) |
| `0x2715` | wallpaper 21 | item | 2240 | yes (560) | yes (560) |
| `0x2716` | wallpaper 22 | item | 1450 | yes (362) | yes (362) |
| `0x2717` | wallpaper 23 | item | 1450 | yes (362) | yes (362) |
| `0x2718` | wallpaper 24 | item | 1480 | yes (370) | yes (370) |
| `0x2719` | wallpaper 25 | item | 35552 | yes (8888) | yes (8888) |
| `0x271A` | wallpaper 26 | item | 800 | yes (200) | yes (200) |
| `0x271B` | wallpaper 27 | item | 6400 | yes (1600) | yes (1600) |
| `0x271C` | wallpaper 28 | item | 1960 | yes (490) | yes (490) |
| `0x271D` | wallpaper 29 | item | 1780 | yes (445) | yes (445) |
| `0x271E` | wallpaper 30 | item | 1580 | yes (395) | yes (395) |
| `0x271F` | wallpaper 31 | item | 1150 | yes (287) | yes (287) |
| `0x2720` | wallpaper 32 | item | 1150 | yes (287) | yes (287) |
| `0x2721` | wallpaper 33 | item | 1120 | yes (280) | yes (280) |
| `0x2722` | wallpaper 34 | item | 1200 | yes (300) | yes (300) |
| `0x2723` | wallpaper 35 | item | 2450 | yes (612) | yes (612) |
| `0x2724` | wallpaper 36 | item | 2660 | yes (665) | yes (665) |
| `0x2725` | wallpaper 37 | item | 1050 | yes (262) | yes (262) |
| `0x2726` | wallpaper 38 | item | 1250 | yes (312) | yes (312) |
| `0x2727` | wallpaper 39 | item | 1200 | yes (300) | yes (300) |
| `0x2728` | wallpaper 40 | item | 2240 | yes (560) | yes (560) |
| `0x2729` | wallpaper 41 | item | 1320 | yes (330) | yes (330) |
| `0x272A` | wallpaper 42 | item | 800 | yes (200) | yes (200) |
| `0x272B` | wallpaper 43 | item | 7000 | yes (1750) | yes (1750) |
| `0x272C` | wallpaper 44 | item | 9200 | yes (2300) | yes (2300) |
| `0x272D` | wallpaper 45 | item | 1470 | yes (367) | yes (367) |
| `0x272E` | wallpaper 46 | item | 6800 | yes (1700) | yes (1700) |
| `0x272F` | wallpaper 47 | item | 48960 | yes (12240) | yes (12240) |
| `0x2730` | wallpaper 48 | item | 8000 | yes (2000) | yes (2000) |
| `0x2731` | wallpaper 49 | item | 7400 | yes (1850) | yes (1850) |
| `0x2732` | wallpaper 50 | item | 2100 | yes (525) | yes (525) |
| `0x2733` | wallpaper 51 | item | 2150 | yes (537) | yes (537) |
| `0x2734` | wallpaper 52 | item | 7500 | yes (1875) | yes (1875) |
| `0x2735` | wallpaper 53 | item | 7200 | yes (1800) | yes (1800) |
| `0x2736` | wallpaper 54 | item | 1500 | yes (375) | yes (375) |
| `0x2737` | wallpaper 55 | item | 800 | yes (200) | yes (200) |
| `0x2738` | wallpaper 56 | item | 7000 | yes (1750) | yes (1750) |
| `0x2739` | wallpaper 57 | item | 9000 | yes (2250) | yes (2250) |
| `0x273A` | wallpaper 58 | item | 1680 | yes (420) | yes (420) |
| `0x273B` | wallpaper 59 | item | 2250 | yes (562) | yes (562) |
| `0x273C` | wallpaper 60 | item | 9200 | yes (2300) | yes (2300) |
| `0x273D` | wallpaper 61 | item | 1320 | yes (330) | yes (330) |
| `0x273E` | wallpaper 62 | item | 1240 | yes (310) | yes (310) |
| `0x273F` | wallpaper 63 | item | 1280 | yes (320) | yes (320) |
| `0x2740` | wallpaper 64 | item | 8000 | yes (2000) | yes (2000) |
| `0x2741` | wallpaper 65 | item | 9000 | yes (2250) | yes (2250) |
| `0x2742` | wallpaper 66 | item | 4800 | yes (1200) | yes (1200) |
| `0x2800` | apple | item | 400 | yes (500) | no |
| `0x2801` | cherry | item | 400 | yes (500) | no |
| `0x2802` | pear | item | 400 | yes (500) | no |
| `0x2803` | peach | item | 400 | yes (500) | no |
| `0x2804` | orange | item | 400 | yes (500) | no |
| `0x2805` | mushroom | item | 20000 | yes (5000) | no |
| `0x2806` | candy | item | 100 | yes (25) | no |
| `0x2807` | coconut | item | 600 | yes (150) | no |
| `0x2900` | sapling | item | 60 | yes (15) | yes (15) |
| `0x2901` | cedar sapling | item | 60 | yes (15) | yes (15) |
| `0x2902` | white pansy bag | item | 120 | yes (30) | yes (30) |
| `0x2903` | purple pansy bag | item | 120 | yes (30) | yes (30) |
| `0x2904` | yellow pansy bag | item | 120 | yes (30) | yes (30) |
| `0x2905` | white cosmos bag | item | 120 | yes (30) | yes (30) |
| `0x2906` | pink cosmos bag | item | 120 | yes (30) | yes (30) |
| `0x2907` | blue cosmos bag | item | 120 | yes (30) | yes (30) |
| `0x2908` | red tulip bag | item | 120 | yes (30) | yes (30) |
| `0x2909` | white tulip bag | item | 120 | yes (30) | yes (30) |
| `0x290A` | yellow tulip bag | item | 120 | yes (30) | yes (30) |
| `0x2A00` | music 0 | item | 20 | yes (5) | no |
| `0x2A01` | music 1 | item | 20 | yes (5) | no |
| `0x2A02` | music 2 | item | 20 | yes (5) | no |
| `0x2A03` | music 3 | item | 20 | yes (5) | no |
| `0x2A04` | music 4 | item | 20 | yes (5) | no |
| `0x2A05` | music 5 | item | 20 | yes (5) | no |
| `0x2A06` | music 6 | item | 20 | yes (5) | no |
| `0x2A07` | music 7 | item | 20 | yes (5) | no |
| `0x2A08` | music 8 | item | 20 | yes (5) | no |
| `0x2A09` | music 9 | item | 20 | yes (5) | no |
| `0x2A0A` | music 10 | item | 20 | yes (5) | no |
| `0x2A0B` | music 11 | item | 20 | yes (5) | no |
| `0x2A0C` | music 12 | item | 20 | yes (5) | no |
| `0x2A0D` | music 13 | item | 20 | yes (5) | no |
| `0x2A0E` | music 14 | item | 20 | yes (5) | no |
| `0x2A0F` | music 15 | item | 20 | yes (5) | no |
| `0x2A10` | music 16 | item | 20 | yes (5) | no |
| `0x2A11` | music 17 | item | 20 | yes (5) | no |
| `0x2A12` | music 18 | item | 20 | yes (5) | no |
| `0x2A13` | music 19 | item | 20 | yes (5) | no |
| `0x2A14` | music 20 | item | 20 | yes (5) | no |
| `0x2A15` | music 21 | item | 20 | yes (5) | no |
| `0x2A16` | music 22 | item | 20 | yes (5) | no |
| `0x2A17` | music 23 | item | 20 | yes (5) | no |
| `0x2A18` | music 24 | item | 20 | yes (5) | no |
| `0x2A19` | music 25 | item | 20 | yes (5) | no |
| `0x2A1A` | music 26 | item | 20 | yes (5) | no |
| `0x2A1B` | music 27 | item | 20 | yes (5) | no |
| `0x2A1C` | music 28 | item | 20 | yes (5) | no |
| `0x2A1D` | music 29 | item | 20 | yes (5) | no |
| `0x2A1E` | music 30 | item | 20 | yes (5) | no |
| `0x2A1F` | music 31 | item | 20 | yes (5) | no |
| `0x2A20` | music 32 | item | 20 | yes (5) | no |
| `0x2A21` | music 33 | item | 20 | yes (5) | no |
| `0x2A22` | music 34 | item | 20 | yes (5) | no |
| `0x2A23` | music 35 | item | 20 | yes (5) | no |
| `0x2A24` | music 36 | item | 20 | yes (5) | no |
| `0x2A25` | music 37 | item | 20 | yes (5) | no |
| `0x2A26` | music 38 | item | 20 | yes (5) | no |
| `0x2A27` | music 39 | item | 20 | yes (5) | no |
| `0x2A28` | music 40 | item | 20 | yes (5) | no |
| `0x2A29` | music 41 | item | 20 | yes (5) | no |
| `0x2A2A` | music 42 | item | 20 | yes (5) | no |
| `0x2A2B` | music 43 | item | 20 | yes (5) | no |
| `0x2A2C` | music 44 | item | 20 | yes (5) | no |
| `0x2A2D` | music 45 | item | 20 | yes (5) | no |
| `0x2A2E` | music 46 | item | 20 | yes (5) | no |
| `0x2A2F` | music 47 | item | 20 | yes (5) | no |
| `0x2A30` | music 48 | item | 20 | yes (5) | no |
| `0x2A31` | music 49 | item | 20 | yes (5) | no |
| `0x2A32` | music 50 | item | 20 | yes (5) | no |
| `0x2A33` | music 51 | item | 20 | yes (5) | no |
| `0x2A34` | music 52 | item | 20 | yes (5) | no |
| `0x2A35` | music 53 | item | 20 | yes (5) | no |
| `0x2A36` | music 54 | item | 20 | yes (5) | no |
| `0x2B00` | college rule | item | 180 | yes (45) | yes (45) |
| `0x2B01` | school pad | item | 200 | yes (50) | yes (50) |
| `0x2B02` | organizer | item | 1260 | yes (315) | yes (315) |
| `0x2B03` | diary | item | 1450 | yes (362) | yes (362) |
| `0x2B04` | journal | item | 280 | yes (70) | yes (70) |
| `0x2B05` | pink diary | item | 870 | yes (217) | yes (217) |
| `0x2B06` | captain's log | item | 980 | yes (245) | yes (245) |
| `0x2B07` | blue diary | item | 880 | yes (220) | yes (220) |
| `0x2B08` | french notebook | item | 1250 | yes (312) | yes (312) |
| `0x2B09` | scroll | item | 1200 | yes (300) | yes (300) |
| `0x2B0A` | pink plaid pad | item | 320 | yes (80) | yes (80) |
| `0x2B0B` | blue polka pad | item | 320 | yes (80) | yes (80) |
| `0x2B0C` | green plaid pad | item | 320 | yes (80) | yes (80) |
| `0x2B0D` | red polka pad | item | 320 | yes (80) | yes (80) |
| `0x2B0E` | yellow plaid pad | item | 320 | yes (80) | yes (80) |
| `0x2B0F` | calligraphy pad | item | 860 | yes (215) | yes (215) |
| `0x3000` | purple balloon | furniture | 40 | no | yes (10) |
| `0x3004` | Bunny P. balloon | furniture | 80 | no | yes (20) |
| `0x3008` | Bunny B. balloon | furniture | 80 | no | yes (20) |
| `0x300C` | Bunny O. balloon | furniture | 80 | no | yes (20) |
| `0x3010` | Lady Liberty | furniture | 9200 | no | yes (2300) |
| `0x3014` | Arc De Triomphe | furniture | 9200 | no | yes (2300) |
| `0x3018` | stone coin | furniture | 5600 | no | yes (1400) |
| `0x301C` | mermaid statue | furniture | 7600 | no | yes (1900) |
| `0x3020` | post model | furniture | 64000 | no | yes (16000) |
| `0x3024` | house model | furniture | 36000 | no | yes (9000) |
| `0x3028` | manor model | furniture | 64000 | no | yes (16000) |
| `0x302C` | police model | furniture | 46000 | no | yes (11500) |
| `0x3030` | museum model | furniture | 48000 | no | yes (12000) |
| `0x3034` | plate armor | furniture | 7400 | no | yes (1850) |
| `0x3038` | moon dumpling | furniture | 7200 | no | yes (1800) |
| `0x303C` | bean set | furniture | 7200 | no | yes (1800) |
| `0x3040` | osechi | furniture | 7200 | no | yes (1800) |
| `0x3044` | lovely phone | furniture | 10400 | no | yes (2600) |
| `0x3048` | market model | furniture | 40000 | no | yes (10000) |
| `0x304C` | Katrina's tent | furniture | 40000 | no | yes (10000) |
| `0x3050` | Chinese lion | furniture | 4800 | no | yes (1200) |
| `0x3054` | tanabata palm | furniture | 1925 | no | yes (481) |
| `0x3058` | spring medal | furniture | 15200 | no | yes (3800) |
| `0x305C` | fall medal | furniture | 15200 | no | yes (3800) |
| `0x3060` | shop model | furniture | 46000 | no | yes (11500) |
| `0x3064` | compass | furniture | 1280 | no | yes (320) |
| `0x3068` | long-life noodle | furniture | 4000 | no | yes (1000) |
| `0x306C` | bass boat | furniture | 4800 | no | yes (1200) |
| `0x3070` | lighthouse model | furniture | 27200 | no | yes (6800) |
| `0x3074` | life ring | furniture | 1250 | no | yes (312) |
| `0x3078` | tree model | furniture | 1400 | no | yes (350) |
| `0x307C` | pink tree model | furniture | 1400 | no | yes (350) |
| `0x3080` | weed model | furniture | 880 | no | yes (220) |
| `0x3084` | tailor model | furniture | 48000 | no | yes (12000) |
| `0x3088` | dump model | furniture | 21200 | no | yes (5300) |
| `0x308C` | mortar ball | furniture | 6000 | no | yes (1500) |
| `0x3090` | Snowman | furniture | 12000 | no | yes (3000) |
| `0x3094` | miniature car | furniture | 10000 | no | yes (2500) |
| `0x3098` | big catch flag | furniture | 12800 | no | yes (3200) |
| `0x309C` | moon | furniture | 32000 | no | yes (8000) |
| `0x30A0` | locomotive model | furniture | 20000 | no | yes (5000) |
| `0x30A4` | dolly | furniture | 10000 | no | yes (2500) |
| `0x30A8` | station model 1 | furniture | 64000 | no | yes (16000) |
| `0x30AC` | station model 2 | furniture | 64000 | no | yes (16000) |
| `0x30B0` | station model 3 | furniture | 64000 | no | yes (16000) |
| `0x30B4` | station model 4 | furniture | 64000 | no | yes (16000) |
| `0x30B8` | station model 5 | furniture | 64000 | no | yes (16000) |
| `0x30BC` | station model 6 | furniture | 64000 | no | yes (16000) |
| `0x30C0` | station model 7 | furniture | 64000 | no | yes (16000) |
| `0x30C4` | station model 8 | furniture | 64000 | no | yes (16000) |
| `0x30C8` | station model 9 | furniture | 64000 | no | yes (16000) |
| `0x30CC` | station model 10 | furniture | 64000 | no | yes (16000) |
| `0x30D0` | station model 11 | furniture | 64000 | no | yes (16000) |
| `0x30D4` | station model 12 | furniture | 64000 | no | yes (16000) |
| `0x30D8` | station model 13 | furniture | 64000 | no | yes (16000) |
| `0x30DC` | station model 14 | furniture | 64000 | no | yes (16000) |
| `0x30E0` | station model 15 | furniture | 64000 | no | yes (16000) |
| `0x30E4` | well model | furniture | 43384 | no | yes (10846) |
| `0x30E8` | grass model | furniture | 1200 | no | yes (300) |
| `0x30EC` | track model | furniture | 1400 | no | yes (350) |
| `0x30F0` | dirt model | furniture | 1200 | no | yes (300) |
| `0x30F4` | train car model | furniture | 2500 | no | yes (625) |
| `0x30F8` | orange box | furniture | 80 | no | yes (20) |
| `0x30FC` | college rule | furniture | 180 | no | yes (45) |
| `0x3100` | school pad | furniture | 200 | no | yes (50) |
| `0x3104` | organizer | furniture | 1260 | no | yes (315) |
| `0x3108` | diary | furniture | 1450 | no | yes (362) |
| `0x310C` | journal | furniture | 280 | no | yes (70) |
| `0x3110` | pink diary | furniture | 870 | no | yes (217) |
| `0x3114` | captain's log | furniture | 980 | no | yes (245) |
| `0x3118` | blue diary | furniture | 880 | no | yes (220) |
| `0x311C` | french notebook | furniture | 1250 | no | yes (312) |
| `0x3120` | scroll | furniture | 1200 | no | yes (300) |
| `0x3124` | pink plaid pad | furniture | 320 | no | yes (80) |
| `0x3128` | blue polka pad | furniture | 320 | no | yes (80) |
| `0x312C` | green plaid pad | furniture | 320 | no | yes (80) |
| `0x3130` | red polka pad | furniture | 320 | no | yes (80) |
| `0x3134` | yellow plaid pad | furniture | 320 | no | yes (80) |
| `0x3138` | calligraphy pad | furniture | 860 | no | yes (215) |
| `0x313C` | golden net | furniture | 0 | no | yes (0) |
| `0x3140` | golden axe | furniture | 0 | no | yes (0) |
| `0x3144` | golden shovel | furniture | 0 | no | yes (0) |
| `0x3148` | golden rod | furniture | 0 | no | yes (0) |
| `0x314C` | bluebell fan | furniture | 600 | no | yes (150) |
| `0x3150` | plum fan | furniture | 600 | no | yes (150) |
| `0x3154` | bamboo fan | furniture | 600 | no | yes (150) |
| `0x3158` | cloud fan | furniture | 600 | no | yes (150) |
| `0x315C` | maple fan | furniture | 600 | no | yes (150) |
| `0x3160` | fan fan | furniture | 800 | no | yes (200) |
| `0x3164` | flower fan | furniture | 1000 | no | yes (250) |
| `0x3168` | leaf fan | furniture | 520 | no | yes (130) |
| `0x316C` | yellow pinwheel | furniture | 480 | no | yes (120) |
| `0x3170` | red pinwheel | furniture | 480 | no | yes (120) |
| `0x3174` | tiger pinwheel | furniture | 480 | no | yes (120) |
| `0x3178` | green pinwheel | furniture | 480 | no | yes (120) |
| `0x317C` | pink pinwheel | furniture | 480 | no | yes (120) |
| `0x3180` | striped pinwheel | furniture | 480 | no | yes (120) |
| `0x3184` | flower pinwheel | furniture | 800 | no | yes (200) |
| `0x3188` | fancy pinwheel | furniture | 800 | no | yes (200) |
| `0x318C` | net | furniture | 500 | no | yes (125) |
| `0x3190` | axe | furniture | 400 | no | yes (100) |
| `0x3194` | shovel | furniture | 500 | no | yes (125) |
| `0x3198` | fishing rod | furniture | 500 | no | yes (125) |
| `0x319C` | crab stew | furniture | 1380 | no | yes (345) |
| `0x31A0` | fireplace | furniture | 2200 | no | yes (550) |
| `0x31A4` | igloo model | furniture | 2350 | no | yes (587) |
| `0x31A8` | snowy tree model | furniture | 1400 | no | yes (350) |
| `0x31AC` | snowcone machine | furniture | 980 | no | yes (245) |
| `0x31B0` | treasure chest | furniture | 10000 | no | yes (2500) |
| `0x31B4` | beach chair | furniture | 1850 | no | yes (462) |
| `0x31B8` | beach table | furniture | 1600 | no | yes (400) |
| `0x31BC` | hibachi grill | furniture | 1580 | no | yes (395) |
| `0x31C0` | surfboard | furniture | 1400 | no | yes (350) |
| `0x31C4` | snowboard | furniture | 1400 | no | yes (350) |
| `0x31C8` | wave breaker | furniture | 1760 | no | yes (440) |
| `0x31CC` | ukulele | furniture | 1600 | no | yes (400) |
| `0x31D0` | Diver Dan | furniture | 3200 | no | yes (800) |
| `0x31D4` | snow bunny | furniture | 860 | no | yes (215) |
| `0x31D8` | scary painting | furniture | 0 | no | yes (0) |
| `0x31DC` | novel painting | furniture | 0 | no | yes (0) |
| `0x31E0` | sleigh | furniture | 1200 | no | yes (300) |
| `0x31E4` | Nintendo bench | furniture | 120 | no | yes (30) |
| `0x31E8` | G logo | furniture | 2500 | no | yes (625) |
| `0x31EC` | merge sign | furniture | 850 | no | yes (212) |
| `0x31F0` | bottle rocket | furniture | 4200 | no | yes (1050) |
| `0x31F4` | wet roadway sign | furniture | 850 | no | yes (212) |
| `0x31F8` | detour sign | furniture | 830 | no | yes (207) |
| `0x31FC` | men at work sign | furniture | 850 | no | yes (212) |
| `0x3200` | lefty desk | furniture | 1240 | no | yes (310) |
| `0x3204` | righty desk | furniture | 1240 | no | yes (310) |
| `0x3208` | school desk | furniture | 1320 | no | yes (330) |
| `0x320C` | flagman sign | furniture | 850 | no | yes (212) |
| `0x3210` | fishing trophy | furniture | 9800 | no | yes (2450) |
| `0x3214` | jersey barrier | furniture | 1050 | no | yes (262) |
| `0x3218` | speed sign | furniture | 870 | no | yes (217) |
| `0x321C` | golf trophy | furniture | 9200 | no | yes (2300) |
| `0x3220` | teacher's desk | furniture | 1580 | no | yes (395) |
| `0x3224` | haz-mat barrel | furniture | 830 | no | yes (207) |
| `0x3228` | tennis trophy | furniture | 8400 | no | yes (2100) |
| `0x322C` | saw horse | furniture | 900 | no | yes (225) |
| `0x3230` | kart trophy | furniture | 8900 | no | yes (2225) |
| `0x3234` | bug zapper | furniture | 1200 | no | yes (300) |
| `0x3238` | telescope | furniture | 5800 | no | yes (1450) |
| `0x323C` | coffee machine | furniture | 2100 | no | yes (525) |
| `0x3240` | bird bath | furniture | 1450 | no | yes (362) |
| `0x3244` | barbecue | furniture | 1760 | no | yes (440) |
| `0x3248` | radiator | furniture | 2380 | no | yes (595) |
| `0x324C` | lawn chair | furniture | 1180 | no | yes (295) |
| `0x3250` | chess table | furniture | 2200 | no | yes (550) |
| `0x3254` | candy machine | furniture | 2200 | no | yes (550) |
| `0x3258` | backyard pool | furniture | 990 | no | yes (247) |
| `0x325C` | cement mixer | furniture | 1600 | no | yes (400) |
| `0x3260` | jackhammer | furniture | 1880 | no | yes (470) |
| `0x3264` | tiki torch | furniture | 870 | no | yes (217) |
| `0x3268` | birdhouse | furniture | 1620 | no | yes (405) |
| `0x326C` | potbelly stove | furniture | 2000 | no | yes (500) |
| `0x3270` | bus stop | furniture | 820 | no | yes (205) |
| `0x3274` | hamster cage | furniture | 2290 | no | yes (572) |
| `0x3278` | flip-top desk | furniture | 1320 | no | yes (330) |
| `0x327C` | festive flag | furniture | 680 | no | yes (170) |
| `0x3280` | Super Tortimer | furniture | 512 | no | yes (128) |
| `0x3284` | bird feeder | furniture | 1260 | no | yes (315) |
| `0x3288` | teacher's chair | furniture | 1440 | no | yes (360) |
| `0x328C` | steam roller | furniture | 4500 | no | yes (1125) |
| `0x3290` | Mr. Flamingo | furniture | 1530 | no | yes (382) |
| `0x3294` | mailbox | furniture | 4000 | no | yes (1000) |
| `0x3298` | festive candle | furniture | 1600 | no | yes (400) |
| `0x329C` | hammock | furniture | 1320 | no | yes (330) |
| `0x32A0` | garden gnome | furniture | 3380 | no | yes (845) |
| `0x32A4` | Mrs. Flamingo | furniture | 1530 | no | yes (382) |
| `0x32A8` | spring medal | furniture | 56000 | no | yes (14000) |
| `0x32AC` | autumn medal | furniture | 56000 | no | yes (14000) |
| `0x32B0` | tumbleweed | furniture | 520 | no | yes (130) |
| `0x32B4` | cow skull | furniture | 1020 | no | yes (255) |
| `0x32B8` | oil drum | furniture | 840 | no | yes (210) |
| `0x32BC` | saddle fence | furniture | 2180 | no | yes (545) |
| `0x32C0` | western fence | furniture | 880 | no | yes (220) |
| `0x32C4` | watering trough | furniture | 1100 | no | yes (275) |
| `0x32C8` | Luigi trophy | furniture | 7000 | no | yes (1750) |
| `0x32CC` | Mario trophy | furniture | 7000 | no | yes (1750) |
| `0x32D0` | harvest lamp | furniture | 13332 | no | yes (3333) |
| `0x32D4` | covered wagon | furniture | 3800 | no | yes (950) |
| `0x32D8` | storefront | furniture | 3680 | no | yes (920) |
| `0x32DC` | picnic table | furniture | 1390 | no | yes (347) |
| `0x32E0` | harvest table | furniture | 13332 | no | yes (3333) |
| `0x32E4` | harvest TV | furniture | 13332 | no | yes (3333) |
| `0x32E8` | harvest bed | furniture | 13332 | no | yes (3333) |
| `0x32EC` | harvest chair | furniture | 13332 | no | yes (3333) |
| `0x32F0` | harvest clock | furniture | 13332 | no | yes (3333) |
| `0x32F4` | harvest sofa | furniture | 13332 | no | yes (3333) |
| `0x32F8` | green pipe | furniture | 1024 | no | yes (256) |
| `0x32FC` | brick block | furniture | 1024 | no | yes (256) |
| `0x3300` | harvest bureau | furniture | 13332 | no | yes (3333) |
| `0x3304` | flagpole | furniture | 1024 | no | yes (256) |
| `0x3308` | harvest dresser | furniture | 13332 | no | yes (3333) |
| `0x330C` | super mushroom | furniture | 1024 | no | yes (256) |
| `0x3310` | harvest mirror | furniture | 13332 | no | yes (3333) |
| `0x3314` | coin | furniture | 1024 | no | yes (256) |
| `0x3318` | ? block | furniture | 1024 | no | yes (256) |
| `0x331C` | starman | furniture | 1024 | no | yes (256) |
| `0x3320` | koopa shell | furniture | 1024 | no | yes (256) |
| `0x3324` | cannon | furniture | 1024 | no | yes (256) |
| `0x3328` | desert cactus | furniture | 890 | no | yes (222) |
| `0x332C` | fire flower | furniture | 1024 | no | yes (256) |
| `0x3330` | wagon wheel | furniture | 1230 | no | yes (307) |
| `0x3334` | well | furniture | 2700 | no | yes (675) |
| `0x3338` | boxing barricade | furniture | 1050 | no | yes (262) |
| `0x333C` | neutral corner | furniture | 5500 | no | yes (1375) |
| `0x3340` | red corner | furniture | 6800 | no | yes (1700) |
| `0x3344` | blue corner | furniture | 6800 | no | yes (1700) |
| `0x3348` | boxing mat | furniture | 1180 | no | yes (295) |
| `0x334C` | ringside table | furniture | 1320 | no | yes (330) |
| `0x3350` | speed bag | furniture | 2990 | no | yes (747) |
| `0x3354` | sandbag | furniture | 3190 | no | yes (797) |
| `0x3358` | weight bench | furniture | 3590 | no | yes (897) |
| `0x335C` | campfire | furniture | 1360 | no | yes (340) |
| `0x3360` | bonfire | furniture | 2240 | no | yes (560) |
| `0x3364` | kayak | furniture | 3460 | no | yes (865) |
| `0x3368` | sprinkler | furniture | 1640 | no | yes (410) |
| `0x336C` | tent model | furniture | 2550 | no | yes (637) |
| `0x3370` | backpack | furniture | 1980 | no | yes (495) |
| `0x3374` | angler trophy | furniture | 7200 | no | yes (1800) |
| `0x3378` | pansy model 1 | furniture | 930 | no | yes (232) |
| `0x337C` | pansy model 2 | furniture | 930 | no | yes (232) |
| `0x3380` | pansy model 3 | furniture | 930 | no | yes (232) |
| `0x3384` | cosmos model 1 | furniture | 910 | no | yes (227) |
| `0x3388` | cosmos model 2 | furniture | 910 | no | yes (227) |
| `0x338C` | cosmos model 3 | furniture | 910 | no | yes (227) |
| `0x3390` | tulip model 1 | furniture | 940 | no | yes (235) |
| `0x3394` | tulip model 2 | furniture | 940 | no | yes (235) |
| `0x3398` | tulip model 3 | furniture | 940 | no | yes (235) |
| `0x339C` | lantern | furniture | 1180 | no | yes (295) |
| `0x33A0` | lawn mower | furniture | 2760 | no | yes (690) |
| `0x33A4` | cooler | furniture | 1300 | no | yes (325) |
| `0x33A8` | mountain bike | furniture | 3380 | no | yes (845) |
| `0x33AC` | sleeping bag | furniture | 1960 | no | yes (490) |
| `0x33B0` | propane stove | furniture | 1470 | no | yes (367) |
| `0x33B4` | cornucopia | furniture | 1880 | no | yes (470) |
| `0x33B8` | judge's bell | furniture | 1790 | no | yes (447) |
| `0x33BC` | noisemaker | furniture | 1600 | no | yes (400) |
| `0x33C0` | chowder | furniture | 1890 | no | yes (472) |
| `0x33C4` |  | furniture | 0 | no | yes (0) |

Not stockable (left out by the game, with the reason on the Mods tab row after a restart, and warned about by `npx playac-mod check`): money, tickets, grab bags, turnips, fossils; at the flower shop, goods with no shop shelf model (all of the game's own furniture); at Nook's, goods with no spot on his shelves (fruit, the signboard). A mod's own new items (content.items) are always stockable at both.

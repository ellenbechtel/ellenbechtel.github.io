function fetchLocation() {

    // First give a loading warning

    d3.select(".lds-ripple").style("display","block");
    d3.select("#streamgraph-section").style("display","block").style("transition","all .5s");
    var watershedContainer = d3.select("#watershed-content-container").style("display","block").style("opacity","0");
    document.getElementById("button1").innerHTML = "Search Again";    
    
    /////////////////////////////////
    // Get City and State, clear previously stored values
    //////////////////////////////////
    var HUCmap = d3.select()
    var city = [];
    var state = [];
    var geocodeAPIURL = "https://maps.googleapis.com/maps/api/geocode/json?address="; // New Google API URL
    // Old Mapquest API URL// "https://open.mapquestapi.com/geocoding/v1/address?key=NkGrSo9aZDYlEaOv3pNN3lvFxuBFmCdK&location=";
    var key = "&key=AIzaSyCLfNu4XdJ_VqyDS3DIlq5DqAKp04S2g8Q";
    //var key = config.key;
    var geocode = [];
    var nwisAPIURL = "https://waterservices.usgs.gov/nwis/dv/?format=json&bBox="
    var lat = [];
    var long = [];
    var birthCoord = [];
    var birthCoordBIG = [];
    var siteStatus = "all"

    city = document.getElementById("city").value;    
    state = document.getElementById("state").value;  



    // MAPQUEST FORMAT
    // http://open.mapquestapi.com/geocoding/v1/address?key=KEY&location=Washington,DC

    // GOOGLE FORMAT
    // https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=YOUR_API_KEY

    /////////////////////////////////
    // Get data for Meet Your Watershed blocks
    //////////////////////////////////

    var rows = [
        {
        "HUC-Number": "01",
        "Name": "New England Region",
        "Boundary-img": "svg/single-hucs_1.svg",
        "NL-img": "img/nl-1.png",
        "Tribes": "Algonkin, including Abenaki, Micmac, Pennacook, Pequot, Mohegan, Nauset, Narragansett, Nipmuc, Woronoco, and Wampanoag",
        "Plant": "Small whorled pogonia",
        "PlantSci": "Isotria medeoloides",
        "Plant-img": "https://upload.wikimedia.org/wikipedia/commons/b/ba/Whorled_Pogonia_-_Flickr_-_pellaea_%281%29.jpg",
        "img-cred-p": "Jason Hollinger/Wikimedia Commons",
        "Animal": "Moose",
        "AnimalSci": "Alces alces americana",
        "Animal-img": "https://upload.wikimedia.org/wikipedia/commons/c/ce/Alces_alces_Cape_Breton_Highlands_National_Park.jpg",
        "img-cred-a": "Martin Cathrae/Wikimedia Commons",
        "Drainage": "The drainage within the United States that ultimately discharges into: (a) the Bay of Fundy; (b) the Atlantic Ocean within and between the states of Maine and Connecticut; (c) Long Island Sound north of the New York-Connecticut state line; and (d) the Riviere St. Francois, a tributary of the St. Lawrence River. Includes all of Maine, New Hampshire and Rhode Island and parts of Connecticut, Massachusetts, New York, and Vermont.",
        "Mineral": "Tourmaline",
        "Mineral-img": "https://upload.wikimedia.org/wikipedia/en/4/4a/Watermelon_Tourmaline.JPG",
        "img-cred-m": "Madereugeneandrew/Wikimedia Commons"
        },
        {
        "HUC-Number": "02",
        "Name": "Mid-Atlantic Region",
        "Boundary-img": "svg/single-hucs_2.svg",
        "NL-img": "img/nl-2.png",
        "Tribes": "Chickahominy, Monacan, Nansemond, Pamunkey, Rappahannock, Upper Mattaponi",
        "Plant": "Bloodroot",
        "PlantSci": "Sanguinaria",
        "Plant-img": "https://upload.wikimedia.org/wikipedia/commons/d/d8/Bloodroot_-_Sanguinaria_canadensis%2C_Riverbend_Park%2C_Great_Falls%2C_Virginia_-_25603767320.jpg",
        "img-cred-p": "Judy Gallagher/Wikimedia Commons",
        "Animal": "Longfin inshore squid",
        "AnimalSci": "Doryteuthis pealeii",
        "Animal-img": "https://img.rawpixel.com/s3fs-private/rawpixel_images/website_content/pd20-240315-num.jpg?w=1300&dpr=1&fit=default&crop=default&q=80&vib=3&con=3&usm=15&bg=F4F4F3&ixlib=js-2.2.1&s=f65da75f74ca1e723b382c3d5a434ad6",
        "img-cred-a": "New York Public Library",
        "Drainage": "The drainage within the United States that ultimately discharges into: (a) the Atlantic Ocean within and between the states of New York and Virginia; (b) Long Island Sound south of the New York-Connecticut State Line; and (c) the Riviere Richelieu, a tributary of the St. Lawrence River. Includes all of Delaware and New Jersey and the District of Columbia, and parts of Connecticut, Maryland, Massachusetts, New York, Pennsylvania, Vermont, Virginia, and West Virginia",
        "Mineral": "Herkimer diamond quartz",
        "Mineral-img": "https://cdn.pixabay.com/photo/2016/06/10/01/42/herkimer-diamond-1447244_1280.jpg",
        "img-cred-m": "WhisperedSecrets/Pixabay"
        },
        {
        "HUC-Number": "03",
        "Name": "South Atlantic-Gulf Region",
        "Boundary-img": "svg/single-hucs_3.svg",
        "NL-img": "img/nl-3.png",
        "Tribes": "Choctaw, Chitimacha, Coushatta, Houma, Tunica, Muscogee (Creek), Seminole, Miccosukee, Alabama, Coushatta",
        "Plant": "Saw palmetto",
        "PlantSci": "Serenoa repens",
        "Plant-img": "https://upload.wikimedia.org/wikipedia/commons/f/f0/Serenoa_repens_13zz.jpg",
        "img-cred-p": "David J. Stang/Wikimedia Commons",
        "Animal": "Florida manatee",
        "AnimalSci": "Trichechus manatus latirostris",
        "Animal-img": "https://c.pxhere.com/photos/aa/64/manatee_wildlife_underwater_sea_cow_mermaid_manatee_close_up_manatee_profile_sea_life-1393804.jpg!d",
        "img-cred-a": "pxhere CC0",
        "Drainage": "The drainage that ultimately discharges into: (a) the Atlantic Ocean within and between the states of Virginia and Florida; (b) the Gulf of Mexico within and between the states of Florida and Louisiana; and (c) the associated waters. Includes all of Florida and South Carolina, and parts of Alabama, Georgia, Louisiana, Mississippi, North Carolina, Tennessee, and Virginia.",
        "Mineral": "Coral agate",
        "Mineral-img": "https://upload.wikimedia.org/wikipedia/commons/2/20/Fossil_agatized_coral_Florida.JPG",
        "img-cred-m": "Wilson44691/Wikimedia Commons"
        },
        {
        "HUC-Number": "04",
        "Name": "Great Lakes Region",
        "Boundary-img": "svg/single-hucs_4.svg",
        "NL-img": "img/nl-4.png",
        "Tribes": "Santee Dakota, Menominee, Ioway, Ho-chunk, Illinois, Potawatomi, Sauk, Mascouten, Fox, Miami, Kickapoo, Shawnee, Anishinabe, Ottawa, Petun, Nipissing, Algonkin, Huron, Iroquois",
        "Plant": "Houghton's goldenrod",
        "PlantSci": "Oligoneuron houghtonii",
        "Plant-img": "https://upload.wikimedia.org/wikipedia/commons/3/3c/Solidago_houghtonii_5498589.jpg",
        "img-cred-p": "Rob Routledge/Wikimedia Commons",
        "Animal": "Great blue heron",
        "AnimalSci": "Ardea herodias",
        "Animal-img": "https://upload.wikimedia.org/wikipedia/commons/5/5b/Great_Blue_Heron_at_Lake_Woodruff_-_Flickr_-_Andrea_Westmoreland_%288%29.jpg",
        "img-cred-a": "Andrea Westmoreland/Wikimedia Commons",
        "Drainage": "The drainage within the United States that ultimately discharges into: (a) the Great Lakes system, including the lake surfaces, bays, and islands; and (b) the St. Lawrence River to the Riviere Richelieu drainage boundary. Includes parts of Illinois, Indiana, Michigan, Minnesota, New York, Ohio, Pennsylvania, and Wisconsin.",
        "Mineral": "Copper",
        "Mineral-img": "https://upload.wikimedia.org/wikipedia/commons/0/06/Native_Copper_Macro_Digon3.jpg",
        "img-cred-m": "Jonathan Zander/Wikimedia Commons"
        },
        {
        "HUC-Number": "05",
        "Name": "Ohio Region",
        "Boundary-img": "svg/single-hucs_5.svg",
        "NL-img": "img/nl-5.png",
        "Tribes": "Anishinaabe/Ojibwe, Ottawa, Delaware, Iroquois including Mohawk, Oneida, Onondaga, Cayuga, Seneca, Tuscarora; Miami, Shawnee, Wyandot, Piqua, Kickapoo, Illinois, Huron, Honniasont",
        "Plant": "Appalachian filmy fern",
        "PlantSci": "Trichomanes boshianum",
        "Plant-img": "https://www.fs.fed.us/wildflowers/plant-of-the-week/images/appalachianbristlefern/Trichomanes_boschianum_6A_lg.jpg",
        "img-cred-p": "David D. Taylor/USFS",
        "Animal": "Eastern red bat",
        "AnimalSci": "Lasiurus borealis",
        "Animal-img": "https://upload.wikimedia.org/wikipedia/commons/f/fd/Red_bat_%2815a%29.jpg",
        "img-cred-a": "Chris Harshaw/Wikimedia Commons",
        "Drainage": "The drainage of the Ohio River Basin, excluding the Tennessee River Basin. Includes parts of Illinois, Indiana, Kentucky, Maryland, New York, North Carolina, Ohio, Pennsylvania, Tennessee, Virginia and West Virginia.",
        "Mineral": "Sphalerite",
        "Mineral-img": "https://upload.wikimedia.org/wikipedia/commons/5/54/Sphalerite_%28mine_near_Carthage%2C_Tennessee%2C_USA%29_1_%2844862884385%29.jpg",
        "img-cred-m": "James St. John/Wikimedia Commons"
        },
        {
        "HUC-Number": "06",
        "Name": "Tennessee Region",
        "Boundary-img": "svg/single-hucs_6.svg",
        "NL-img": "img/nl-6.png",
        "Tribes": "Quapaw, Chickasaw, Shawnee, Yuchi, Koasati, Cherokee, Chikamaka Cherokee, Etowah Cherokee, Muscogee (Creek), Natchez, Catawba",
        "Plant": "Butternut hickory",
        "PlantSci": "Carya cordiformis",
        "Plant-img": "https://upload.wikimedia.org/wikipedia/commons/b/b9/Carya_cordiformis_%28Bitternut_Hickory%29_%2833645993593%29.jpg",
        "img-cred-p": "Boston Plant Image Library/Wikimedia Commons",
        "Animal": "Washboard mussel",
        "AnimalSci": "Megalonaias nervosa",
        "Animal-img": "https://upload.wikimedia.org/wikipedia/commons/7/79/Naturalis_Biodiversity_Center_-_ZMA.MOLL.209650_-_Megalonaias_nervosa_%28Rafinesque%2C_1820%29_-_Unionidae_-_Mollusc_shell.jpeg",
        "img-cred-a": "Naturalis Biodiversity Center/Wikimedia Commons",
        "Drainage": "The drainage of the Tennessee River Basin. Includes parts of Alabama, Georgia, Kentucky, Mississippi, North Carolina, Tennessee, and Virginia.",
        "Mineral": "Freshwater pearls",
        "Mineral-img": "https://upload.wikimedia.org/wikipedia/commons/d/da/Pearl-freshwater_hg.jpg",
        "img-cred-m": "Hannes Grobe/AWI/Wikimedia Commons"
        },
        {
        "HUC-Number": "07",
        "Name": "Upper Mississippi Basin Region",
        "Boundary-img": "svg/single-hucs_7.svg",
        "NL-img": "img/nl-7.png",
        "Tribes": "Ibitoupa, Tiou, Choctaw, Chickasaw, Chakchiuma, Quapaw, Taposa, Chula, Yazoo, Tunica, Koroa, Natchez Grigra",
        "Plant": "Prairie aster",
        "PlantSci": "Eurybia hemispherica",
        "Plant-img": "https://upload.wikimedia.org/wikipedia/commons/e/e0/Eurybia_hemispherica.jpg",
        "img-cred-p": "Eric Hunt/Wikimedia Commons",
        "Animal": "Muskrat",
        "AnimalSci": "Ondatra zibethicus",
        "Animal-img": "https://upload.wikimedia.org/wikipedia/commons/e/e3/Ondatra_zibethicus_-_Naturhistorisches_Museum%2C_Braunschweig%2C_Germany_-_DSC05054.JPG",
        "img-cred-a": "Daderot/Wikimedia Commons",
        "Drainage": "The drainage of the Mississippi River Basin above the confluence with the Ohio River, excluding the Missouri River Basin. Includes parts of Illinois, Indiana, Iowa, Michigan, Minnesota, Missouri, South Dakota, and Wisconsin.",
        "Mineral": "Beryl",
        "Mineral-img": "https://commons.wikimedia.org/wiki/File:Beryl-271349.jpg",
        "img-cred-m": "Robert M. Lavinsky/Wikimedia Commons"
        },
        {
        "HUC-Number": "08",
        "Name": "Lower Mississippi Region",
        "Boundary-img": "svg/single-hucs_8.svg",
        "NL-img": "img/nl-8.png",
        "Tribes": "Choctaw, Pascagoula, Biloxi, Pensacola, Capinans/Moctobi,  Acolapissa, Houma, Natchez Grigra, Ofo/Ofogoula, Sawoki, Tiou",
        "Plant": "Green-fly orchid",
        "PlantSci": "Epidendrum magnoliae",
        "Plant-img": "https://upload.wikimedia.org/wikipedia/commons/0/09/Epidendrum_conopseum_2.jpg",
        "img-cred-p": "berichard/Wikimedia Commons",
        "Animal": "Longear sunfish",
        "AnimalSci": "Lepomis megalotis",
        "Animal-img": "https://upload.wikimedia.org/wikipedia/commons/2/29/Lepomis_megalotis_UMFS_2014.jpg",
        "img-cred-a": "Fredlyfish4/Wikimedia Commons",
        "Drainage": "The drainage of: (a) the Mississippi River below its confluence with the Ohio River, excluding the Arkansas, Red, and White River Basins above the points of highest backwater effect of the Mississippi River in those basins; and (b) coastal streams that ultimately discharge into the Gulf of Mexico from the Pearl River Basin boundary to the Sabine River and Sabine Lake drainage boundary. Includes parts of Arkansas, Kentucky Louisiana, Mississippi, Missouri, and Tennessee.",
        "Mineral": "Fulgurite",
        "Mineral-img": "https://upload.wikimedia.org/wikipedia/commons/d/d8/Fulgurite-Adrar_mauritanien_%282%29.jpg",
        "img-cred-m": "Ji-Elle/Wikimedia Commons"
        },
        {
        "HUC-Number": "09",
        "Name": "Souris-Red-Rainy Region",
        "Boundary-img": "svg/single-hucs_9.svg",
        "NL-img": "img/nl-9.png",
        "Tribes": "Mandan, Hidatsa, Arikara, Yanktonia, Sisseton, Wahpeton, Hunkpapa and other Dakotah/Lakotah (more commonly known as the Sioux) Tribes, along with the Pembina Chippewa, Cree and Meti, Anishinaabe/Ojibwe,",
        "Plant": "Mountain holly",
        "PlantSci": "Ilex mucronata",
        "Plant-img": "https://upload.wikimedia.org/wikipedia/commons/4/4e/Ilex_mucronata_5473069.jpg",
        "img-cred-p": "Rob Routledge/Wikimedia Commons",
        "Animal": "Northern leopard frog",
        "AnimalSci": "Lithobates pipiens",
        "Animal-img": "https://storage.needpix.com/rsynced_images/frog-4186782_1280.jpg",
        "img-cred-a": "Jimmy Larkin/Pixabay",
        "Drainage": "The drainage within the United states of the Lake of the Woods and the Rainy, Red, and Souris River Basins that ultimately discharges into Lake Winnipeg and Hudson Bay. Includes parts of Minnesota, North Dakota, and South Dakota.",
        "Mineral": "Thomsonite",
        "Mineral-img": "https://upload.wikimedia.org/wikipedia/commons/d/d0/Thomsonite.jpg",
        "img-cred-m": "Linnell/Wikimedia Commons"
        },
        {
        "HUC-Number": "10",
        "Name": "Missouri Region",
        "Boundary-img": "svg/single-hucs_10.svg",
        "NL-img": "img/nl-10.png",
        "Tribes": "Missouria, Osage, Quapaw, Chickasaw, Illini, Ioway, Otoe-Missouria, Sac & Fox, Shawnee",
        "Plant": "Water locust",
        "PlantSci": "Gleditsia aquatica",
        "Plant-img": "https://upload.wikimedia.org/wikipedia/commons/1/1d/Gleditsia_Aquatica_%27Water_Locust%27_%284023008476%29.jpg",
        "img-cred-p": "Rob Young/Wikimedia Commons",
        "Animal": "Nine-banded armadillo",
        "AnimalSci": "Dasypus novemcinctus",
        "Animal-img": "https://cdn.pixabay.com/photo/2018/01/05/12/36/devotional-battleship-3062825_1280.jpg",
        "img-cred-a": "zoosnow/Pixabay",
        "Drainage": "The drainage within the United states of: (a) the Missouri River Basin, (b) the Saskatchewan River Basin, and (c) several small closed basins. Includes all of Nebraska and parts of Colorado, Iowa, Kansas, Minnesota, Missouri, Montana, North Dakota, South Dakota, and Wyoming.",
        "Mineral": "Barite",
        "Mineral-img": "https://upload.wikimedia.org/wikipedia/commons/a/a9/Barite_crystals.jpg",
        "img-cred-m": "The High Fin Sperm Whale/Wikimedia Commons"
        },
        {
        "HUC-Number": "11",
        "Name": "Arkansas-White-Red Region",
        "Boundary-img": "svg/single-hucs_11.svg",
        "NL-img": "img/nl-11.png",
        "Tribes": "Binger/Caddo, Pawhuska/Osage, Quapaw, Tahlequah/Cherokee, Tunica-Biloxi",
        "Plant": "American yellowwood",
        "PlantSci": "Cladrastis kentukea",
        "Plant-img": "https://upload.wikimedia.org/wikipedia/commons/7/73/Cladrastis_kentukea_Str%C4%85czyn_%C5%BC%C3%B3%C5%82ty_2017-10-15_01.jpg",
        "img-cred-p": "Agnieszka Kwiecień/Wikimedia Commons",
        "Animal": "Scissor-tailed flycatcher",
        "AnimalSci": "Tyrannus forficatus",
        "Animal-img": "https://upload.wikimedia.org/wikipedia/commons/4/49/Scissor-tailed_Flycatcher_RWD7.jpg",
        "img-cred-a": "Dick Daniels/Wikimedia Commons",
        "Drainage": "The drainage of the Arkansas, White, and Red River Basins above the points of highest backwater effect of the Mississippi River. Includes all of Oklahoma and parts of Arkansas, Colorado, Kansas, Louisiana, Missouri, New Mexico, and Texas.",
        "Mineral": "Barite rose",
        "Mineral-img": "https://upload.wikimedia.org/wikipedia/commons/c/cb/Desert_Rose_%283603556389%29.jpg",
        "img-cred-m": "Hadley Paul Garland/Wikimedia Commons"
        },
        {
        "HUC-Number": "12",
        "Name": "Texas-Gulf Region",
        "Boundary-img": "svg/single-hucs_12.svg",
        "NL-img": "img/nl-12.png",
        "Tribes": "Karankawa, Atakapa, Mariame, Akokisa",
        "Plant": "Purple silkyscale",
        "PlantSci": "Anthaenatia rufa",
        "Plant-img": "https://warcapps.usgs.gov/PlantID/Image/GivenFile?id=2798&file=Anthaenantia%20rufa_0001.jpg",
        "img-cred-p": "USGS",
        "Animal": "Swamp rabbit",
        "AnimalSci": "Sylvilagus aquaticus",
        "Animal-img": "https://upload.wikimedia.org/wikipedia/commons/c/c1/Swamp_Rabbit_%28Sylvilagus_aquaticus%29.jpg",
        "img-cred-a": "Glenn E. Wilson/Wikimedia Commons",
        "Drainage": "The drainage that discharges into the Gulf of Mexico from and including Sabine Pass to the Rio Grande Basin boundary. Includes parts of Louisiana, New Mexico, and Texas.",
        "Mineral": "Topaz",
        "Mineral-img": "https://upload.wikimedia.org/wikipedia/commons/7/78/Topaz-tz03b.jpg",
        "img-cred-m": "Robert M. Lavinsky/Wikimedia Commons"
        },
        {
        "HUC-Number": "13",
        "Name": "Rio Grande Region",
        "Boundary-img": "svg/single-hucs_13.svg",
        "NL-img": "img/nl-14.png",
        "Tribes": "Lipan and Mescalero Apache, Comanche, Coahuiltecan, Huastecan, Kickapoo, Tonkawa",
        "Plant": "Coulter's balsam apple",
        "PlantSci": "Echinopepon coulteri",
        "Plant-img": "https://wnmu.edu/academic/nspages/gilaflora/e_coulteri1.jpg",
        "img-cred-p": "Russ Kleinman, Richard Felger, & Carey Anne Lafferty",
        "Animal": "Green jay",
        "AnimalSci": "Cyanocorax yncas",
        "Animal-img": "https://upload.wikimedia.org/wikipedia/commons/2/22/Green_Jay_%2834831200091%29.jpg",
        "img-cred-a": "Andy Morffew/Wikimedia Commons",
        "Drainage": "The drainage within the United states of: (a) the Rio Grande Basin, and (b) the San Luis Valley, North Plains, Plains of San Agustin, Mimbres River, Estancia, Jornada Del Muerto, Tularosa Valley, Salt Basin, and Other Closed  Basins. Includes parts of Colorado, New Mexico, and Texas.",
        "Mineral": "Opal",
        "Mineral-img": "https://upload.wikimedia.org/wikipedia/commons/f/fb/Luminescent_hyalite_opal_%28Sierra_Madre_Occidental_Volcanic_Province%2C_mid-Tertiary%3B_Zacatecas%2C_Mexico%29_1_%2826442890801%29.jpg",
        "img-cred-m": "James St. John/Wikimedia Commons"
        },
        {
        "HUC-Number": "14",
        "Name": "Upper Colorado Region",
        "Boundary-img": "svg/single-hucs_14.svg",
        "NL-img": "img/nl-15.png",
        "Tribes": "Navajo, Ute, Uintah, Ouray, Goshute, Jicarilla Apache, Kewa Pueblo, Shoshone, Mescalero, Ohkay Owingeh, Paiute, Pueblo, Ysleta del Sur Pueblo",
        "Plant": "Reclined gumweed",
        "PlantSci": "Grindelia decumbens",
        "Plant-img": "https://upload.wikimedia.org/wikipedia/commons/a/a0/Curlycup_Gumweed.jpg?1607130259455",
        "img-cred-p": "Cory Maylett/Wikimedia Commons",
        "Animal": "Coyote",
        "AnimalSci": "Canis latrans",
        "Animal-img": "https://cdn.pixabay.com/photo/2012/09/21/19/44/coyote-57490_1280.jpg",
        "img-cred-a": "ArtTower/Pixabay",
        "Drainage": "The drainage of: (a) the Colorado River Basin above the Lee Ferry compact point which is one mile below the mouth of the Paria River; and (b) the Great Divide closed basin. Includes parts of Arizona, Colorado, New Mexico, Utah, and Wyoming.",
        "Mineral": "Jasper",
        "Mineral-img": "https://upload.wikimedia.org/wikipedia/commons/7/7c/Jasper_outcrop_in_the_Bucegi_Mountains.jpg",
        "img-cred-m": "Tommy/Wikimedia Commons"
        },
        {
        "HUC-Number": "15",
        "Name": "Lower Colorado Region",
        "Boundary-img": "svg/single-hucs_15.svg",
        "NL-img": "img/nl-15.png",
        "Tribes": "Yuman, Quapaw, Mojave, Cocopa, Kamia, Halyikwamai, Alikwisa, Kohuana, Kamia, Halchidhoma",
        "Plant": "Sand reverchonia",
        "PlantSci": "Phyllanthus warnockii",
        "Plant-img": "https://upload.wikimedia.org/wikipedia/commons/8/89/Phyllanthus_cocumbiensis_-_collected_by_John_Gossweiler_%281946%29.jpg",
        "img-cred-p": "John Gossweiler/Jean F. Brunel/Röpert D./Wikimedia Commons",
        "Animal": "Flat-tail horned lizard",
        "AnimalSci": "Phrynosoma mcallii",
        "Animal-img": "https://pixnio.com/free-images/fauna-animals/reptiles-and-amphibians/lizards-and-geckos-pictures/flat-tailed-horned-lizard-face-363x544.jpg",
        "img-cred-a": "Jim Rorabaugh/USFWS",
        "Drainage": "The drainage within the United States of: (a) the Colorado River Basin below the Lee Ferry compact point which is one mile below the mouth of the Paria River; (b) streams that originate within the United States and ultimately discharge into the Gulf of California; and (c) the Animas Valley, Willcox Playa, and other smaller closed basins. Includes parts of Arizona, California, Nevada, New Mexico, and Utah.",
        "Mineral": "Turquoise",
        "Mineral-img": "https://upload.wikimedia.org/wikipedia/commons/a/a5/Turquoise%2C_pyrite%2C_quartz_300-4-FS_1.jpeg",
        "img-cred-m": "Parent Géry/Wikimedia Commons"
        },
        {
        "HUC-Number": "16",
        "Name": "Great Basin Region",
        "Boundary-img": "svg/single-hucs_16.svg",
        "NL-img": "img/nl-16.png",
        "Tribes": "Western Shoshone, Goshute, Ute, Paiute, Washoe",
        "Plant": "Beaver dam breadroot",
        "PlantSci": "Pediomelum castoreum",
        "Plant-img": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Pediomelum_subacaule_Kaldari_01.jpg/2560px-Pediomelum_subacaule_Kaldari_01.jpg",
        "img-cred-p": "Kaldari/Wikimedia Commons",
        "Animal": "Yellow-bellied marmot",
        "AnimalSci": "Marmota flaviventris",
        "Animal-img": "https://upload.wikimedia.org/wikipedia/commons/5/5a/Marmot_on_rocks.jpg",
        "img-cred-a": "Inklein/Wikimedia Commons",
        "Drainage": "The drainage of the Great Basin that discharges into the states of Utah and Nevada. Includes Parts of California, Idaho, Nevada, Oregon, Utah, and Wyoming.",
        "Mineral": "Amethyst",
        "Mineral-img": "https://cdn.pixabay.com/photo/2019/07/24/20/49/amethyst-4361160_1280.jpg",
        "img-cred-m": "almapapi/Pixabay"
        },
        {
        "HUC-Number": "17",
        "Name": "Pacific Northwest Region",
        "Boundary-img": "svg/single-hucs_17.svg",
        "NL-img": "img/nl-17.png",
        "Tribes": "Tlingit, Tsimshian, Haida, Kwakiutl, Bella Coola, Kwakiutl, Nuu-Chah-Nulth, Makah, Quileute-Chimakum, Kwalhioqua, Chinook, Tillamook, Kalapuya, Alsae, Siuslaw, Coos, Umpqua, Tututni-Tolowa, Kabok, Yurok, Wiyot, Hupa, Nisga'a, Haida, Gitxsan, Haisla, Heiltsuk, Wuikinuxv, Kwakwaka'wakw, Makah, Coast Salish, Chimakum, Quileute, Willapa, Da'naxda'xw",
        "Plant": "Western cow bane",
        "PlantSci": "Oxypolis occidentalis",
        "Plant-img": "https://upload.wikimedia.org/wikipedia/commons/5/5d/Oxypolis_rigidior_NRCS-1.jpg",
        "img-cred-p": "Robert H. Mohlenbrock/USDA/Wikimedia Commons",
        "Animal": "Sockeye salmon",
        "AnimalSci": "Oncorhynchus nerka",
        "Animal-img": "https://cdn.pixabay.com/photo/2017/09/17/23/19/salmon-2760196_1280.jpg",
        "img-cred-a": "Barbara Jackson/Pixabay",
        "Drainage": "The drainage within the United States that ultimately discharges into: (a) the Straits of Georgia and of Juan De Fuca, and (b) the Pacific Ocean within the states of Oregon and Washington; and that part of the Great Basin whose discharge is into the state of Oregon. Includes all of Washington and parts of California, Idaho, Montana, Nevada, Oregon, Utah, and Wyoming.",
        "Mineral": "Thunder egg agate",
        "Mineral-img": "https://upload.wikimedia.org/wikipedia/commons/e/e9/Thunder_Egg_Agate_%28Priday_Blue_Bed%2C_John_Day_Formation%2C_Miocene%3B_near_Madras%2C_Oregon%2C_USA%29_2_%2834416129410%29.jpg",
        "img-cred-m": "James St. John/Wikimedia Commons"
        },
        {
        "HUC-Number": "18",
        "Name": "California Region",
        "Boundary-img": "svg/single-hucs_18.svg",
        "NL-img": "img/nl-18.png",
        "Tribes": "Karok, Maidu, Cahuilleno, Mojave, Yokut, Pomo, Paiute, Modoc, Achomawi/Pit River, Atsugewi, Ahwahnechee, Cahuilla, Chumash, Chilula, Chimariko, Coso, Cupeño, Eel River Athapaskan, Esselen, Hupa, Juaneño/Acjachemen, Karok, Kato, Kawaiisu, Kitanemuk, Konkow, Kucadikadi, Kumeyaay, Luiseño, Maidu, Miwok, Mojave,Monache, Mono, Nomlaki, Ohlone, Patayan, Patwin, Pauma, Pomo, Salinan, Serrano, Shasta, Tataviam, Timbisha, Tolowa, Tongva, Tubatulabal, Wappo, Washoe, Whilkut, Wintu, Wiyot, Yana, Yokut, Yuku, Yurok",
        "Plant": "Johnson's fishhook cactus",
        "PlantSci": "Echinomastus johnsonii",
        "Plant-img": "https://upload.wikimedia.org/wikipedia/commons/f/fc/Echinomastus_johnsonii_1.jpg",
        "img-cred-p": "Stan Shebs/Wikimedia Commons",
        "Animal": "California newt",
        "AnimalSci": "Taricha torosa",
        "Animal-img": "https://upload.wikimedia.org/wikipedia/commons/f/f7/Coast_Range_Newt%2C_Taricha_torosa_torosa_-_Flickr_-_GregTheBusker_%284%29.jpg",
        "img-cred-a": "Greg Schechter/Wikimedia Commons",
        "Drainage": "(a) the drainage within the United States that ultimately discharges into the Pacific Ocean within the state of California; and (b) those parts of the Great Basin (or other closed basins) that discharge into the state of California. Includes parts of California, Nevada, and Oregon.",
        "Mineral": "Jade",
        "Mineral-img": "https://upload.wikimedia.org/wikipedia/commons/9/9a/Interlayered_hydrogrossular_garnetite_and_chromitite_%28Transvaal_jade%29_%28Critical_Zone%2C_Bushveld_Complex%2C_Paleoproterozoic%2C_~2.05_Ga%3B_Bonjanala_Platinum_District%2C_South_Africa%29_2.jpg",
        "img-cred-m": "jsj1771/Wikimedia Commons"
        },
        {
        "HUC-Number": "19",
        "Name": "Alaska Region",
        "Boundary-img": "svg/single-hucs_19.svg",
        "NL-img": "img/nl-19.png",
        "Tribes": "Aleuit, Inupiat/Northern Eskimo, Yuit/Southern Eskimo, Athabascan, Tlingit, Haida",
        "Plant": "Alaska Spiraea",
        "PlantSci": "Spiraea stevenii",
        "Plant-img": "https://upload.wikimedia.org/wikipedia/commons/0/03/Spiraea_stevenii_8583.JPG",
        "img-cred-p": "Walter Siegmund/Wikimedia Commons",
        "Animal": "Orca",
        "AnimalSci": "Orcinus orca",
        "Animal-img": "https://upload.wikimedia.org/wikipedia/commons/1/1a/Orca_Alaska.jpg",
        "img-cred-a": "Christopher Michel/Wikimedia Commons",
        "Drainage": "The drainage within the State of Alaska. Includes all of Alaska.",
        "Mineral": "Garnet",
        "Mineral-img": "https://upload.wikimedia.org/wikipedia/commons/5/5e/Garnet_Andradite20.jpg",
        "img-cred-m": "Moha112100/Wikimedia Commons"
        },
        {
        "HUC-Number": "20",
        "Name": "Hawaii Region",
        "Boundary-img": "svg/single-hucs_20.svg",
        "NL-img": "img/nl-20.png",
        "Tribes": "Kānaka Maoli/Native Hawaiian",
        "Plant": "Hawai'i silversword/hinahina",
        "PlantSci": "Argyroxiphium sandwicense",
        "Plant-img": "https://upload.wikimedia.org/wikipedia/commons/e/e1/Haleakalasilversword.jpg",
        "img-cred-p": "Witort/Wikimedia Commons",
        "Animal": "Green sea turtle",
        "AnimalSci": "Chelonia mydas",
        "Animal-img": "https://c.pxhere.com/photos/df/e2/photo-1614282.jpg!d",
        "img-cred-a": "pxhere CC0",
        "Drainage": "The drainage within the State of Hawaii. Includes all of Hawaii.",
        "Mineral": "Peridot",
        "Mineral-img": "https://upload.wikimedia.org/wikipedia/commons/5/56/Peridot_-_Mineral_Cabinet_%28Arppeanum%29_-_DSC05499.JPG",
        "img-cred-m": "Daderot/Wikimedia Commons"
        },
        {
        "HUC-Number": "21",
        "Name": "Puerto Rico and Caribbean",
        "Boundary-img": "svg/single-hucs_21.svg",
        "NL-img": "img/nl-21.png",
        "Tribes": "Taîno, Island Carib, Guanahatabey",
        "Plant": "Sea grape",
        "PlantSci": "Coccoloba uvifera",
        "Plant-img": "https://upload.wikimedia.org/wikipedia/commons/f/f4/Uva_de_playa_%28Coccoloba_uvifera%29.jpg",
        "img-cred-p": "Wilfredor/Wikimedia Commons",
        "Animal": "Caribbean reef shark",
        "AnimalSci": "Carcharhinus perezii",
        "Animal-img": "https://upload.wikimedia.org/wikipedia/commons/5/59/Caribbean_reef_shark.jpg",
        "img-cred-a": "Albert Kok/Wikimedia Commons",
        "Drainage": "The drainage within: (a) the Commonwealth of Puerto Rico; (b) the Virgin Islands of the United States; and (c) other United States Caribbean outlying areas. Includes land areas over which the United States has some degree of interest, jurisdiction, or sovereignty.",
        "Mineral": "Serpentinite",
        "Mineral-img": "https://upload.wikimedia.org/wikipedia/commons/2/29/Stichtitic_serpentinite%2C_Dundas_Ultramafic_Complex.jpg",
        "img-cred-m": "James St. John/Wikimedia Commons"
        }
        ];

    /////////////////////////////////
    // Get data for the river hydroscopes
    //////////////////////////////////

    var hydrorows = [
        {
        "name": "Arkansas River",
        "hydroscope": "When French traders sought to exchange goods with Canadian Native tribes along the Arkansas River, they learned that the birchbark canoes they had been using to the North were too light. Instead, they learned to make dugout canoes called pirogues from the surrounding cottonwood trees.<br><br><span class='scope'>You may need to learn from the people and setting around you to adjust a strategy you've used in the past. The Arkansas River's path has changed over time, and so will yours.</span>",
        "huc": 11,
        "huc_name": "Arkansas-White-Red Region",
        "station_nm": "Arkansas River at Pine Bluff, AR",
        "site_number": "07263650",
        "vector": ""
        },
        {
        "name": "Bear River",
        "hydroscope": "The Bear River makes almost a full U-turn, and it is the longest river in North America that doesn't ultimately reach the sea.<br><br><span class='scope'>Don't be discouraged when you feel you are retracing old steps, or not bound for the same destination as others. You are simply on an unconventional path to success.</span>",
        "huc": 16,
        "huc_name": "Great Basin Region",
        "station_nm": "Bear River Near Corinne, UT",
        "site_number": "10126000",
        "vector": ""
        },
        {
        "name": "Brazos River",
        "hydroscope": "The Brazos River's full name means \"The River of the Arms of God\", and it is sometimes used to mark the boundary between East and West Texas. In 2012, the lower Brazos received 33.4 million pounds of toxic waste from natural gas, fracking, and agricultural chemicals in the area.<br><br><span class='scope'>Remember that most issues are not black and white. It is more important to keep your body and spirit clean and healthy than spend time and energy putting up walls. You can wield immense personal power when you surrender to the bigger picture.</span>",
        "huc": 12,
        "huc_name": "Texas-Gulf Region",
        "station_nm": "Brazos River at Giww Flood Gates near Freeport, TX",
        "site_number": "08117300",
        "vector": ""
        },
        {
        "name": "Charles River",
        "hydroscope": "The Native name for the Charles River is \"Quinobequin\", which means \"meandering\"; this river doubles back on itself several times. The nation's very first mills and industrial canals were diverted from it. The Charles River directly supported a booming economy, but at the price of its purity; efforts to improve the water quality of the river persist today, and swimmers may not enter it without a special permit.<br><br><span class='scope'>Despite taking what others may consider to be a meandering route, you are a very productive person.  As you begin new ventures, plan how you will take care of yourself, lest you lose sight of the simple pleasures in life.</span>",
        "huc": 1,
        "huc_name": "New England Region",
        "station_nm": "Charles River at First St at Cambridge, MA",
        "site_number": "01104705",
        "vector": ""
        },
        {
        "name": "Chehalis River",
        "hydroscope": "The Chehalis River has flooded several times, closing highways and even bringing Amtrak trains to a halt. During the Ice Age, glacial runoff fed it much larger.<br><br><span class='scope'>You may be given to the occasional dramatic display. Pay attention to what triggers these, as you may be in an unsuitable environment. Remember that you have the power to shift the landscape to your liking. You come from a very powerful lineage of people.</span>",
        "huc": 17,
        "huc_name": "Pacific Northwest Region",
        "station_nm": "Chehalis River Below Wishkah River at Hoquiam, WA",
        "site_number": "12038400",
        "vector": ""
        },
        {
        "name": "Colorado River",
        "hydroscope": "The Colorado River is one of the most controlled, dammed, and utilized rivers in the world.  Intensive water consumption has dried up the lower 100 miles of the river almost entirely.<br><br><span class='scope'>Be careful not to overtax your resources, especially in the final stretch of a phase or project. It is good to be practical, but remember that it is possible to build so much inflexible infrastructure in one's life that it blocks a natural flow of wellness, prosperity, and intuition.</span>",
        "huc": 15,
        "huc_name": "Lower Colorado Region",
        "station_nm": "Colorado River at Section 18S, AZ",
        "site_number": "330131114364101",
        "vector": ""
        },
        {
        "name": "Colorado River of Texas",
        "hydroscope": "The Colorado River of Texas is home to several man-made lakes and dams, but its mouth is located at Matagorda Bay, a marshy inlet which supports a seaport, ghost town, series of rice fields, and an enormous number of birds, fish, and invertebrates.<br><br><span class='scope'>Whatever you are seeking now, there is fertile ground for it in your future. Be patient and don't force it.</span>",
        "huc": 12,
        "huc_name": "Texas-Gulf Region",
        "station_nm": "Colorado River near Wadsworth, TX",
        "site_number": "08162501",
        "vector": ""
        },
        {
        "name": "Columbia River",
        "hydroscope": "The Columbia River connects many cultures in the Pacific Northwest, and is home to various species of fish which migrate between fresh and salt water, quite a rare quality in animals.<br><br><span class='scope'>You are more adaptable and social than most, with a tendency to be a bridge between groups and navigate transitions with ease.</span>",
        "huc": 17,
        "huc_name": "Pacific Northwest Region",
        "station_nm": "Columbia River at Port Westward, Near Quincy, OR",
        "site_number": "14246900",
        "vector": ""
        },
        {
        "name": "Connecticut River",
        "hydroscope": "The Connecticut River has been the at the center of centuries of border disputes, between tribes, colonies, states, and eventually even countries.<br><br><span class='scope'>People might fight over their rights to your time and talent. Don't sweat it - carve your own course.</span>",
        "huc": 1,
        "huc_name": "New England Region",
        "station_nm": "Connecticut River at Old Lyme, CT",
        "site_number": "01194796",
        "vector": ""
        },
        {
        "name": "Delaware River",
        "hydroscope": "The Delaware is a famous river, and rightly so: as well as being the site of major historical events, this river has supported shipping, viticulture, and several dredging projects to form canals that would make it more suitable for these activities. The river has also suffered major oil spills over the years.<br><br><span class='scope'>You may be prone to overtaxing yourself, or under a significant amount of stress at the moment. Don't reshape yourself too drastically to meet these demands, but dig deeper to find the calm and strength you need to carry out your projects. Perhaps you could drop a commitment or two.</span>",
        "huc": 2,
        "huc_name": "Mid Atlantic Region",
        "station_nm": "Delaware River at Chester, PA",
        "site_number": "01477050",
        "vector": ""
        },
        {
        "name": "Eel River",
        "hydroscope": "The Eel River, or Taanchow River to the Kato people, changes every day. Because of earthquakes and extreme weather, its course and flow rates are quite variable. This river is greatly affected by agriculture and industry, but was designated off-limits to new dams in 1981 under the Wild and Scenic River program.<br><br><span class='scope'>You may find your circumstances to be turbulent, or notice that you have frequent changes of heart. You may need to implement some protective measures in your life to give you the stability you need to thrive under these conditions.</span>",
        "huc": 18,
        "huc_name": "California Region",
        "station_nm": "Eel River at Fernbridge, CA",
        "site_number": "11479560",
        "vector": ""
        },
        {
        "name": "Guadalupe River",
        "hydroscope": "The Guadalupe River is home to the southernmost run of Chinook salmon in the United States.<br><br><span class='scope'>You may find yourself in a unique position, gifted with a special treasure or talent but not feeling as if you quite fit in to the group that's formed around it. Recent DNA sequencing proved that these salmon have been native to this watershed for centuries. Whatever you've been blessed with, there is no need to worry about whether it is truly yours.</span>",
        "huc": 12,
        "huc_name": "Texas-Gulf Region",
        "station_nm": "Guadalupe River at Sh 35 near Tivoli, TX",
        "site_number": "08188810",
        "vector": ""
        },
        {
        "name": "Hoh River",
        "hydroscope": "The Hoh River is fed by glaciers, whose fine sediment lend it a slate blue color in places.<br><br><span class='scope'>You may be inclined toward the occasional bout of the \"blues\", or phases where you feel something is clouding your vision. The Hoh's color returns to normal as it is joined by tributaries. Joining forces with those who are headed in the same direction may help you achieve clarity.</span>",
        "huc": 17,
        "huc_name": "Pacific Northwest Region",
        "station_nm": "Hoh River at Us Highway 101 Near Forks, WA",
        "site_number": "12041200",
        "vector": ""
        },
        {
        "name": "Hudson River",
        "hydroscope": "The Hudson River starts as Feldspar Brook, before it is joined by the Opalescent River, which in turn becomes Calamity Brook. Despite being one of America's most iconic rivers, it is not known by its common name until well along its course.<br><br><span class='scope'>You may be destined to live through a series of identities in this lifetime. Embrace these changes with grace, and if you ever doubt your consistency, know that it is precisely your multifaceted nature that makes you who you are.</span>",
        "huc": 2,
        "huc_name": "Mid Atlantic Region",
        "station_nm": "Hudson River at Pier 84 at New York, NY",
        "site_number": "01376515",
        "vector": ""
        },
        {
        "name": "Humboldt River",
        "hydroscope": "The Humboldt River is almost 100 miles longer than formal estimates have previously held, because it sports so many twists and turns.<br><br><span class='scope'>There is almost certainly more to you than meets the eye, but don't worry about proving it; it will become obvious in due time.</span>",
        "huc": 16,
        "huc_name": "Great Basin Region",
        "station_nm": "Humboldt River near Rye Patch, NV",
        "site_number": "10335000",
        "vector": ""
        },
        {
        "name": "James River",
        "hydroscope": "The James River, first called the Powhatan River by the Native American Powhatan Confederacy, once served as a major trade route for tobacco and produce, but eventually fell victim to a large spill of insecticide which contaminated the river and damaged many local economies.<br><br><span class='scope'>You may have much luck and success in the material world; be careful not to become so protective of it that it damages your community.</span>",
        "huc": 2,
        "huc_name": "Mid Atlantic Region",
        "station_nm": "James River at Jamestown Ferry Pier, VA",
        "site_number": "02042770",
        "vector": ""
        },
        {
        "name": "Jordan River",
        "hydroscope": "The Jordan River is regulated by pumps at its headwaters. Originally a cold-water fishery supporting several native species of fish, the waters have warmed up common carp now rule its waters. The Jordan is a key resource for another group of animals, however, providing food, water, and habitat to the thousands of migrating birds that migrate up and down the flyways of the Great Basin.<br><br><span class='scope'>If one avenue has \"dried up,\" you may need to look in unexpected places––or put in a bit of elbow grease––to find new motivation and community.</span>",
        "huc": 16,
        "huc_name": "Great Basin Region",
        "station_nm": "Jordan River @ Cudahy Lane near Salt Lake City, UT",
        "site_number": "10172600",
        "vector": ""
        },
        {
        "name": "Kennebec River",
        "hydroscope": "The Kennebec is a fairly still and calm river––it has no rapids at all––and because of its accessibility and connection to the Atlantic Ocean, several ships have been built there. It brings to mind the John A. Shedd quote: \"A ship in harbor is safe, but that is not what ships are built for.\"<br><br><span class='scope'>You may be destined for great deeds and adventures beyond the calm waters of your comfort zone. Don't worry; you were built for them.</span>",
        "huc": 1,
        "huc_name": "New England Region",
        "station_nm": "Kennebec River at Gardiner, ME",
        "site_number": "01049505",
        "vector": ""
        },
        {
        "name": "Kern River",
        "hydroscope": "The Fort Tejon earthquake in 1857 completely switched the direction of the Kern River, temporarily stranding fish on its banks. It is still treacherous in places, and sometimes known as the \"killer Kern.\" Tubing and rafting are popular activities along its turbulent rapids.<br><br><span class='scope'>You may find yourself navigating unexpected and even dangerous conditions in your life. Prioritize your own safety, but don't shy away from the occasional adrenaline rush. Just make sure to resume in your original direction when whatever event is shaking things up has passed.</span>",
        "huc": 18,
        "huc_name": "California Region",
        "station_nm": "Kern River near Bakersfield, CA",
        "site_number": "11194000",
        "vector": ""
        },
        {
        "name": "Klamath River",
        "hydroscope": "The Klamath River has been called an \"upside down river,\" because unlike most rivers, it begins in the desert and flows through the mountains before reaching the sea. It boasts many of the longest free-flowing stretches of river along the west coast of the United States.<br><br><span class='scope'>Sometimes it will be necessary for you to defy expectations and norms to find your freedom.</span>",
        "huc": 18,
        "huc_name": "California Region",
        "station_nm": "Klamath River near Klamath, CA",
        "site_number": "11530500",
        "vector": ""
        },
        {
        "name": "Little Red River",
        "hydroscope": "Greers Ferry dam has had a major impact on the Little Red River, changing its temperature drastically with the release of large volumes of cold water. This affects the number and type of fish that inhabit this section of the river; what was once known as an excellent trout fishing area has seen the decline of many native warm-water species. If you are inclined to make a great sacrifice in life, especially to gain some kind of power, make sure that what you're building is worth it––and is capable of giving back to the place in which it is anchored.",
        "huc": 11,
        "huc_name": "Arkansas-White-Red Region",
        "station_nm": "Little Red River at Judsonia, AR",
        "site_number": "07076634",
        "vector": ""
        },
        {
        "name": "Merrimack River",
        "hydroscope": "Over the years, the Merrimack has supported a great deal of trade and industry. Massachusetts and New Hampshire are working together to add infiltration wells to increase the amount of drinking water that this historically polluted river can provide.<br><br><span class='scope'>Through collaboration, you may be able to rescue something that was once lost.</span>",
        "huc": 1,
        "huc_name": "New England Region",
        "station_nm": "Merrimack River 0.3 Miles U.S.Rt 125 at Haverhill, ME",
        "site_number": "01100693",
        "vector": ""
        },
        {
        "name": "Mississippi River",
        "hydroscope": "The Mississippi embayment is home to some of the best crop soil in the country. Yet it is precisely the high levels of nutrient and chemical runoff from all the agricultural activity it supports that form the Gulf of Mexico Dead Zone.<br><br><span class='scope'>You may have been given a great gift, but take care not to welcome anything toxic into your life. You will thrive best when you can learn to consider the needs of those far downstream of you.</span>",
        "huc": 8,
        "huc_name": "Lower Mississippi Region",
        "station_nm": "Mississippi River at Baton Rouge, LA",
        "site_number": "07374000",
        "vector": ""
        },
        {
        "name": "Missouri River",
        "hydroscope": "The Missouri River is seen as a tributary of the Mississippi, but on its own, it is much longer and carries almost the same amount of water.<br><br><span class='scope'>You may need to learn what to do when others try to take credit for your work, or you feel as though you are living in someone else's shadow. For now, stand tall on your own merit; eventually, you will effortlessly join forces with whatever is troubling you.</span>",
        "huc": 10,
        "huc_name": "Missouri Region",
        "station_nm": "Missouri River at St. Charles, MO",
        "site_number": "06935965",
        "vector": ""
        },
        {
        "name": "Mobile River",
        "hydroscope": "There are over 100 species of freshwater snail that are endemic to the Mobile River Basin––that means they are found nowhere else in the world! However, extensive damming has created many more shallow shoals than occur naturally, negatively impacting the river's rich biodiversity.<br><br><span class='scope'>You may believe you are ordinary or insignificant, but if given a closer look, your talents and traits are incredibly unique. Don't let the actions or words of others drain you of your depth.</span>",
        "huc": 3,
        "huc_name": "South Atlantic-Gulf Region",
        "station_nm": "Mobile River at River Mile 31.0 at Bucks, AL",
        "site_number": "02470629",
        "vector": ""
        },
        {
        "name": "Neches River",
        "hydroscope": "Much of the habitat of the upper Neches is protected with Wildlife Refuges, Wilderness Areas, and Natural Preserves, while more industrial activities take place downstream, close to the river's mouth which empties into a port.<br><br><span class='scope'>When you put your own needs and connection to the natural world first, you are able to be an effective channel for work, play, and positive change.</span>",
        "huc": 12,
        "huc_name": "Texas-Gulf Region",
        "station_nm": "Neches River Saltwater Barrier at Beaumont, TX",
        "site_number": "08041780",
        "vector": ""
        },
        {
        "name": "Nueces River",
        "hydroscope": "Beautiful pecan trees line the banks of the Nueces, whose name is Spanish for nuts.<br><br><span class='scope'>Pecans historically symbolize health and wealth, and you will have plenty of both if you can relax and truly accept what the tides of good fortune have to bring.</span>",
        "huc": 12,
        "huc_name": "Texas-Gulf Region",
        "station_nm": "Nueces River at Calallen, TX",
        "site_number": "08211500",
        "vector": ""
        },
        {
        "name": "Ohio River",
        "hydroscope": "The Ohio River is known as a \"climactic transition area,\" as it transits between subtropical and continental climate zones. This means that part of the river regularly freezes, but its other end where it meets the Mississippi, it never does. This river supported major trade routes for the Iroquoian and Mississippian Native tribes.<br><br><span class='scope'>You may feel you have two different \"faces\" at times, but this can be a great gift in the context of communication and exchange.</span>",
        "huc": 5,
        "huc_name": "Ohio Region",
        "station_nm": "Ohio River at Olmstead Buoy 3, IL",
        "site_number": "370812089055901",
        "vector": ""
        },
        {
        "name": "Piscataqua River",
        "hydroscope": "The Piscataqua is a tidal river, with its Abenaki name loosely translated to \"branch with strong current.\"<br><br><span class='scope'>You may feel exceptionally sensitive to the rise and fall of the emotions of others or conditions in the world, what some call an \"empath.\" This may feel like a curse at first, but when given proper care and attention, it can become a great superpower. Tune in to what the universal tides are trying to communicate.</span>",
        "huc": 1,
        "huc_name": "New England Region",
        "station_nm": "Piscataqua River",
        "site_number": "430521070453501",
        "vector": ""
        },
        {
        "name": "Potomac River",
        "hydroscope": "After mining, agriculture and sewage runoff decimated the Potomac in the 1800s, the development wastewater treatment plants and the restriction of sources of phosphorous under the Clean Water Act had banished the massive algal blooms that had come to curse the river. While the river is still vulnerable to human pressures, especially due to metals, pesticides, and invasive species, it is important to remember how far we've come in protecting it so we can build on our success.<br><br><span class='scope'>Cherish your wins, especially when it comes to eliminating toxic elements from your life, and continue your quest for holistic self-care.</span>",
        "huc": 2,
        "huc_name": "Mid Atlantic Region",
        "station_nm": "Potomac River at Cameron St Dock at Alexandria, VA",
        "site_number": "0165258890",
        "vector": ""
        },
        {
        "name": "Presumpscot River",
        "hydroscope": "The Presumpscot River Preserve has been protected for twenty years by the State of Maine and the City of Portland. The river also supports hydroelectric power downstream.<br><br><span class='scope'>You're doing a good job protecting something valuable while also staying productive. Way to go!</span>",
        "huc": 1,
        "huc_name": "New England Region",
        "station_nm": "Presumpscot River at Westbrook, ME",
        "site_number": "01064118",
        "vector": ""
        },
        {
        "name": "Rainy River",
        "hydroscope": "The International Game Fish Association All-Tackle world record was set along this river, by a man named Joel Anderson, who caught a white sucker that weighed almost seven pounds.<br><br><span class='scope'>Sometimes you may feel like a big fish in a small pond. You are actually just a pretty big fish overall. Celebrate your accomplishments.</span>",
        "huc": 9,
        "huc_name": "Souris-Red-Rainy Region",
        "station_nm": "Rainy River Near Boat Landing at Wheelers Point, MN",
        "site_number": "05137500",
        "vector": "svg/single-hucs-9.svg"
        },
        {
        "name": "Red River",
        "hydroscope": "Clay and silt containing iron oxides give the Red River its color––it is almost literally \"rusty.\"<br><br><span class='scope'>If there is an old skill, pleasure, or relationship that has become rusty, it may be a good time to breathe some life back into it.</span>",
        "huc": 11,
        "huc_name": "Arkansas-White-Red Region",
        "station_nm": "Red River north of Simmesport, LA",
        "site_number": "07355690",
        "vector": ""
        },
        {
        "name": "Red River of the North",
        "hydroscope": "This river has been enormously prone to flooding, including ancient \"paleofloods\" which have left visible traces of their dramatic effects on local landscapes. Floods symbolize cleansing, and in some Hindu mythology, a deluge signifies a transition into a new epoch, during which deities try to help humans preserve knowledge for future generations.<br><br><span class='scope'>You may be having an \"Interstellar\" moment: is the future telling you to hold on to some piece of knowledge or wisdom through a great transition?</span>",
        "huc": 9,
        "huc_name": "Souris-Red-Rainy Region",
        "station_nm": "Red River Of The North at Pembina, ND",
        "site_number": "05102490",
        "vector": ""
        },
        {
        "name": "Richelieu River",
        "hydroscope": "This river was originally called \"Masoliantekw\" in Abenaki, meaning \"water where there is plenty of food.\" The Richelieu River has since been the site of many battles among the Iroquois, French, British, and Americans.<br><br><span class='scope'>It may be tempting to fight over resources; remember that conflict arises when we forget that there is enough for everyone.</span>",
        "huc": 4,
        "huc_name": "Great Lakes Region",
        "station_nm": "Richelieu River (Lake Champlain) at Rouses Point Bridge, NY",
        "site_number": "042950000",
        "vector": ""
        },
        {
        "name": "Rio Grande",
        "hydroscope": "The Rio Grande's watershed is massive, but it's even bigger when you count the many \"endorheic\" basins that lie adjacent to the river. An endorheic basin is essentially a closed lake or swamp with no outflow to rivers or the sea. Instead, the water may evaporate and fill with rainfall seasonally.<br><br><span class='scope'>You may occasionally feel isolated or siloed from others.  Remember that connection comes in many forms and is not always apparent right away. If you feel lonely, remember that you are made of the same minerals, and living under the same sun, moon and stars as everyone on Earth. Seasonal changes, physical and metaphorical, are also shared.</span>",
        "huc": 13,
        "huc_name": "Rio Grande Region",
        "station_nm": "Rio Grande near San Benito, TX",
        "site_number": "08473700",
        "vector": ""
        },
        {
        "name": "Rogue River",
        "hydroscope": "The Rogue River is home to many beaver, an animal that symbolizes hope, collaboration, wealth, wisdom, and success in many cultures. However, when European explorers and settlers began trapping beaver for their pelts along the Rogue, violent conflict ensued.<br><br><span class='scope'>The reckless pursuit of wealth or comfort might lead to a devastating battle that renders its winnings meaningless. Remember that true success requires collaboration.</span>",
        "huc": 17,
        "huc_name": "Pacific Northwest Region",
        "station_nm": "Rogue River at Hwy 101 Bridge, at Wedderburn, OR",
        "site_number": "14378430",
        "vector": ""
        },
        {
        "name": "Sabine River",
        "hydroscope": "Bald cypress trees grow along the the Sabine River, or Río de Sabinas, which derives its name from the Spanish word for cypress.  For ancient Europeans and Muslims, cypress represented grief, mourning, and the underworld. However, in ancient Israel, these trees represented healing and eternal life because were known to endure extreme and unfavorable conditions.<br><br><span class='scope'>You may be entering or exiting a period of your life requiring great resilience.  Let yourself mourn for what is lost, but never doubt your inner strength.</span>",
        "huc": 12,
        "huc_name": "Texas-Gulf Region",
        "station_nm": "Sabine River (At Navy Pier) at Orange, TX",
        "site_number": "8030540",
        "vector": ""
        },
        {
        "name": "Saco River",
        "hydroscope": "In the 1600s, Squandro, a Sokokis Native and purported magician, led a tribe that lived in peace with white settlers along the Saco River for decades, until three white sailors arrived on a ship from England and drowned Squandro's son. Squandro then cursed the river, saying that it would \"claim three lives a year, until all white men fled its banks.\" The legend of this \"Saco curse\" lives on to this day. The man-made branch of the Saco is called \"Canal River,\" but the \"Old Course\" of the river remains.<br><br><span class='scope'>There may be something buried in your past that is still affecting you: a path you didn't take, a promise you broke, a devastating loss. But if your life is peaceful and productive now, it may be best to leave well enough alone.</span>",
        "huc": 1,
        "huc_name": "New England Region",
        "station_nm": "Saco River at Camp Ellis Near Saco, ME",
        "site_number": "432742070225401",
        "vector": ""
        },
        {
        "name": "Sacramento River",
        "hydroscope": "Due to its wide, marshy outlet, animals from the Pacific Ocean have occasionally been found lost in the Sacramento River, such as Humphrey the humpback whale. In 1985, Humphrey made it almost 70 miles up the river before being rescued by scientists who played recordings of humpback whale sounds to lure him back to the sea.<br><br><span class='scope'>If something doesn't feel quite right, you may not be where you belong. Occasionally, you may need to enlist others' help to bring you back to yourself. That's okay; you're an adventurer at heart!</span>",
        "huc": 18,
        "huc_name": "California Region",
        "station_nm": "Sacramento River at Rio Vista, CA",
        "site_number": "11455420",
        "vector": ""
        },
        {
        "name": "Saint Lawrence River",
        "hydroscope": "The Saint Lawrence is a tidal river, home to many populations of resident whales, such as belugas, sperm whales, minke whales, fin whales, blue whales, and North Atlantic right whales.  These magnificent animals represent compassion, solitude, and creativity.<br><br><span class='scope'>When in doubt, seek a safe harbor for these ideals to flourish.</span>",
        "huc": 4,
        "huc_name": "Great Lakes Region",
        "station_nm": "St. Lawrence River at Cornwall Ont near Massena, NY",
        "site_number": "04264331",
        "vector": ""
        },
        {
        "name": "Salinas River",
        "hydroscope": "Between 2013 and 2016, the Salinas River's final stretch dried up for the first time in known history; previously, the river flowed continuously year-round. In 2017, heavy rainfall broke the drought, and the river's flow returned to normal. The Salinas provides a migration channel for many forms of wildlife, and nourishes fertile cropland and magnificent vineyards along its path through the Salinas Valley.<br><br><span class='scope'>If you find yourself in a \"dry spell\" in motivation, money, or love, remember that it's not permanent.  Soon, the winds will shift, and inspiration will be flowing once again.</span>",
        "huc": 18,
        "huc_name": "California Region",
        "station_nm": "Salinas River near Spreckels, CA",
        "site_number": "11152500",
        "vector": ""
        },
        {
        "name": "San Joaquin",
        "hydroscope": "The San Joaquin river was once a wide inland sea, and it now supports almost $15 billion worth of crop production in its river basin.<br><br><span class='scope'>Things may look very differently for you now than they once did. Trust the journey.</span>",
        "huc": 18,
        "huc_name": "California Region",
        "station_nm": "San Joaquin River at Jersey Point, CA",
        "site_number": "11337190",
        "vector": ""
        },
        {
        "name": "Santa Clara River",
        "hydroscope": "The Santa Clara River is home to stickleback, steelhead, and pond turtles.  Lithe pronghorn antelope once roamed its banks, symbolizing speed, stealth, and instinct. Pronghorns aren't common along the river today, but willow flycatchers are: these darty songbirds perch high atop tree branches and dive dramatically to catch insects in midair.<br><br><span class='scope'>You may feel that an era of nimble maneuvers is behind you. It will come around again, likely in a different form.</span>",
        "huc": 18,
        "huc_name": "California Region",
        "station_nm": "Santa Clara River Near Haines, CA",
        "site_number": "341859119053301",
        "vector": ""
        },
        {
        "name": "Savannah River",
        "hydroscope": "The Savannah River was formed where two other rivers, the Tugaloo and the Seneca, merged. Today, this combined headwater is hidden beneath a lake.<br><br><span class='scope'>Your parents or family members may be very different from one another, but it is this beautiful confluence of opposites that makes you who you are. Don't lose touch with your roots.</span>",
        "huc": 3,
        "huc_name": "South Atlantic-Gulf Region",
        "station_nm": "Savannah River (I-95) Near Port Wentworth, GA",
        "site_number": "0198840",
        "vector": ""
        },
        {
        "name": "Seekonk River",
        "hydroscope": "The Seekonk River banks are home to phragmites grasses, willow, oak, and beech.  Some consider willow bark the original painkiller, and symbolizes healing and recovery from pain, and the oak is an international emblem of strength and survival.<br><br><span class='scope'>When life hands you lemons, call on the wisdom of the natural world to find your inner strength. Phragmites reeds can be used to make flutes; making music or pursuing another creative hobby can help get you through this challenging time.</span>",
        "huc": 1,
        "huc_name": "New England Region",
        "station_nm": "Seekonk River at Henderson Bridge, RI",
        "site_number": "414945071224100",
        "vector": ""
        },
        {
        "name": "Skagit River",
        "hydroscope": "The Savannah River was formed where two other rivers, the Tugaloo and the Seneca, merged. Today, this combined headwater is hidden beneath a lake.<br><br><span class='scope'>Your parents or family members may be very different from one another, but it is this beautiful confluence of opposites that makes you who you are. Don't lose touch with your roots.</span>",
        "huc": 17,
        "huc_name": "Pacific Northwest Region",
        "station_nm": "Skagit River Near Mount Vernon, WA",
        "site_number": "12200500",
        "vector": ""
        },
        {
        "name": "Souris River",
        "hydroscope": "The flow of the Souris River varies greatly with the seasons; most of its volume comes from snowmelt and spring showers.<br><br><span class='scope'>You may be prone to relationships, personality traits, or even types of work that change with the seasons. Embracing this about yourself will allow you to find your own rhythm of consistency.</span>",
        "huc": 9,
        "huc_name": "Souris-Red-Rainy Region",
        "station_nm": "Souris River near Westhope, ND",
        "site_number": "05124000",
        "vector": ""
        },
        {
        "name": "Susquehanna River",
        "hydroscope": "The Susquehanna is one of the oldest rivers in the world, dating from before two pre-continents slammed together! The Susquehanna has supported generations of tribes and traders with its plentiful oyster beds. Oysters are fantastic natural water filters, absorbing sediment and toxins out of the water.<br><br><span class='scope'>If you feel you've lost touch with the ancient source of wisdom within you, try filtering out some noise or \"pollution\" from your life.</span>",
        "huc": 2,
        "huc_name": "Mid Atlantic Region",
        "station_nm": "Susquehanna River at Conowingo, MD",
        "site_number": "01578310",
        "vector": ""
        },
        {
        "name": "Suwannee River",
        "hydroscope": "Fifty-five springs feed the Suwannee as it winds through the Southeast. It also boasts Florida's only whitewater rapids.<br><br><span class='scope'>You may take inspiration from many sources, and transform it into something striking and magical. Indulge your creative side.</span>",
        "huc": 3,
        "huc_name": "South Atlantic-Gulf Region",
        "station_nm": "Suwannee River at Manatee Springs near Old Town, FL",
        "site_number": "02323567",
        "vector": ""
        },
        {
        "name": "Tennessee River",
        "hydroscope": "The Tennessee, or Cherokee, River follows a U-shaped course. This river is a mighty waterway, and its unique shape and geography have made it a strategic military location as well as part of the \"Great Loop\" recreational route.<br><br><span class='scope'>You may have the occasional moment of déja vú, but don't be discouraged if you feel you are retracing old steps.  Sometimes you have to go backwards, and see your own patterns for what they are, to forge ahead.</span>",
        "huc": 6,
        "huc_name": "Tennessee Region",
        "station_nm": "Tennessee River at Mile 5.3 near Paducah, KY",
        "site_number": "370221088314100",
        "vector": ""
        },
        {
        "name": "Upper Colorado River",
        "hydroscope": "One of the longest rivers in the U.S., the Colorado supports elk, moose, bears, cougars, almost 30 dams, and some 40 million people.<br><br><span class='scope'>You are destined for a rich and busy life, filled with color and variety. Don't be alarmed as your social circle widens and narrows just like the Colorado. Those who are truly aligned with you will find you and stick by you.</span>",
        "huc": 14,
        "huc_name": "Upper Colorado Region",
        "station_nm": "Colorado River Ab Dirty Devil River near Hite, UT",
        "site_number": "09328990",
        "vector": ""
        },
        {
        "name": "Upper Mississippi River",
        "hydroscope": "The headwaters of the Mississippi are located at Lake Itasca, a small glacial lake in Northern Minnesota. This lake is only some 20 feet deep; looking at it, you'd be hard-pressed to tell it was the source of the nation's most iconic river.<br><br><span class='scope'>You have great potential within you; do not underestimate yourself, or let yourself be underestimated by others.</span>",
        "huc": 7,
        "huc_name": "Upper Mississippi Region",
        "station_nm": "Mississippi River at Thebes, IL",
        "site_number": "07022000",
        "vector": ""
        },
        {
        "name": "Warroad River",
        "hydroscope": "After a diversion of the Warroad River's main channel caused flooding and damage to local roads, a watershed district project moved it back to its original path, and the hazard was eliminated.<br><br><span class='scope'>When in doubt, stick with your first instinct –– it is often correct. Trusting your intuition can save you time and money in the long run.</span>",
        "huc": 9,
        "huc_name": "Souris-Red-Rainy Region",
        "station_nm": "Warroad River Near Highway 11 at Warroad, MN",
        "site_number": "05140515",
        "vector": ""
        },
        {
        "name": "Weber River",
        "hydroscope": "A rare plant species called \"hidden wirelettuce,\" with beautiful bright-pink flowers, is found along––and only along––the Weber River's corridor.<br><br><span class='scope'>You have something special to share with the world. Protect what makes you unique.</span>",
        "huc": 16,
        "huc_name": "Great Basin Region",
        "station_nm": "Weber River Near Plain City, UT",
        "site_number": "10141000",
        "vector": ""
        },
        {
        "name": "White River",
        "hydroscope": "The White River's headwaters are \"fast and furious\" during winter and spring rains, and calm the rest of the year.<br><br><span class='scope'>You may be prone to similarly furious bursts of work, love, or inspiration. Ride these waves with grace, but when the rush is over, don't lose your spark in the rhythm of everyday life.</span>",
        "huc": 11,
        "huc_name": "Arkansas-White-Red Region",
        "station_nm": "White River near Augusta, AR",
        "site_number": "07074850",
        "vector": ""
        }];
    /////////////////////////////////
    // Write accessor functions
    //////////////////////////////////

        // Create function for getting the huc of interest
        function get_row_by_huc(huc) {
            // check huc is within bounds 
             //...
            // create dict mapping huc to row
            let row_by_huc = {}
            rows.forEach((row)=>{
                row_by_huc[row["HUC-Number"]] = row;
            });
    
            // access dict to retrieve row using huc
            return row_by_huc[huc];
        }

        // Create function that makes a div for each river

        var watershedInfo = d3.select("#watershed-info");
        var riverSummary = d3.select("#river-list");
        var hydroscopeContainer = d3.select("#hydroscopes");
        function createRiverdivs(this_huc, riversArray) {
            //first clear the existing content
            riverSummary.html(""); // clear any existing rivers in the list
            hydroscopeContainer.html(""); // clear any existing rivers in the list
            //then repopulate
            var riverNames = [];
            riversArray.forEach(function(river) {
                var this_river = river.name;                
                riverNames.push(this_river);
            })
            riverSummary.selectAll(".river-item")
                .data(riverNames)
                .enter()
                .append('li')
                .text(function(d) { return d })
                .classed("river-item",true);

            // now append new flex items for each river
            var filteredHydroscopes = hydrorows.filter(function(river) {
                return river.huc == this_huc;
            })

            var html = function(d) { return "<div class='vector flex-pic'></div><h3 class='card-title'>" + d.name + "</h3><p>" + d.hydroscope + "</p><p><a href='https://waterdata.usgs.gov/monitoring-location/' target='_blank'" + d.site_number + "/#parameterCode=00065'><button>View Live Conditions on this River</button></a></p>"; };
                                   
            hydroscopeContainer.selectAll("flex-item hydroscope")
                .data(filteredHydroscopes, function(d) {
                    return d.name;
                })
                .enter()
                .append("div")
                    .html(html)
                    // .text(function(d) { return d.name; })
                    .classed("flex-item hydroscope", true);
                //.style("background-color","goldenrod")

            
        };

        // Create funciton for getting the rivers in that huc
        function getRivers (this_huc) {
        
            var rivers = hydrorows.filter(function(river) {
                return river.huc == +this_huc;
            })
            createRiverdivs(this_huc, rivers);
        }


        // Create function for population HTML with HUC info
        function spitItOut(this_row) {
            let row = get_row_by_huc(this_row); // ENTER DEMO HUC HERE
            //images
            
            document.getElementById("nlImage").src = row["NL-img"];
            document.getElementById("hucImage").src = row["Boundary-img"];
            // document.getElementById("plantImage").src = row["Plant-img"];
            // document.getElementById("animalImage").src = row["Animal-img"];
            // document.getElementById("mineralImage").src = row["Mineral-img"];
    
            //text
            document.getElementById("HUCname").innerHTML = row["Name"];
            document.getElementById("drainage").innerHTML = row["Drainage"];
            document.getElementById("tribes").innerHTML = row["Tribes"];
            // document.getElementById("plantText").innerHTML = row["Plant"];
            // document.getElementById("plantSci").innerHTML = row["PlantSci"];
            // document.getElementById("plantIC").innerHTML = row["img-cred-p"];
            // document.getElementById("animalText").innerHTML = row["Animal"];
            // document.getElementById("animalSci").innerHTML = row["AnimalSci"];
            // document.getElementById("animalIC").innerHTML = row["img-cred-a"];
            // document.getElementById("mineralText").innerHTML = row["Mineral"];
            // document.getElementById("mineralIC").innerHTML = row["img-cred-m"];

            watershedContainer.style("opacity","1").style("transition","all .5s");
        };

    /////////////////////////////////
    // Compile Geocoding URL
    var geocode = geocodeAPIURL + "+" + city + ",+" + state + key;

    /////////////////////////////////
    // Call API
    d3.json(geocode, function(error, apiData) { 
   

        lat = apiData.results[0].geometry.location.lat;
        long = apiData.results[0].geometry.location.lng;
      
        
        birthCoord.push({
            "lat": lat, 
            "long": long,
            "north": (lat+.1).toFixed(4),
            "east": (long+.1).toFixed(4),
            "south": (lat-.1).toFixed(4),
            "west": (long-.1).toFixed(4)
        });

        birthCoordBIG.push({
            "lat": lat, 
            "long": long,
            "north": (lat+.5).toFixed(4),
            "east": (long+.5).toFixed(4),
            "south": (lat-.5).toFixed(4),
            "west": (long-.5).toFixed(4)
        })

        // https://waterservices.usgs.gov/nwis/dv/?format=json&bBox=-76.4057,39.9381,-76.2057,40.1381,&siteStatus=,all
        // should be
        // https://waterservices.usgs.gov/nwis/dv/?format=json&bBox=-76.405669,39.938130,-76.205669,40.138130&siteStatus=all

        /////////////////////////////////
        // Compile HUC-retreiving URL
        var nwisAPI = [];// clear existing values
        nwisAPI = nwisAPIURL + birthCoord[0].west + "," + birthCoord[0].south + "," + birthCoord[0].east  + "," + birthCoord[0].north  + "&siteStatus="  + siteStatus

        /////////////////////////////////
        // Call NWIS API to determine what HUC02 we're in

        d3.json(nwisAPI, function (error, HUCdata) {
           
            var birthHUC = HUCdata.value.timeSeries[0].sourceInfo.siteProperty[1].value.slice(0,2);
            

            function highlightBirthHUC(birthHUC) {
                
                // compile the variable name from the input
                var all_HUCS = d3.selectAll(".a-huc").style("opacity",".1")
                var myHUC = "";
                
                if (birthHUC == 1) {
                    myHUC = d3.select("#huc1").style("opacity","1")
                } else if (birthHUC == 2) {
                    myHUC = d3.select("#huc2").style("opacity","1")
                } else if (birthHUC == 3) {
                    myHUC = d3.select("#huc3").style("opacity","1")
                } else if (birthHUC == 4) {
                    myHUC = d3.select("#huc4").style("opacity","1")
                } else if (birthHUC == 5) {
                    myHUC = d3.select("#huc5").style("opacity","1")
                } else if (birthHUC == 6) {
                    myHUC = d3.select("#huc6").style("opacity","1")
                } else if (birthHUC == 7) {
                    myHUC = d3.select("#huc7").style("opacity","1")
                } else if (birthHUC == 8) {
                    myHUC = d3.select("#huc8").style("opacity","1")
                } else if (birthHUC == 9) {
                    myHUC = d3.select("#huc9").style("opacity","1")
                } else if (birthHUC == 10) {
                    myHUC = d3.select("#huc10").style("opacity","1")
                } else if (birthHUC == 11) {
                    myHUC = d3.select("#huc11").style("opacity","1")
                } else if (birthHUC == 12) {
                    myHUC = d3.select("#huc12").style("opacity","1")
                } else if (birthHUC == 13) {
                    myHUC = d3.select("#huc13").style("opacity","1")
                } else if (birthHUC == 14) {
                    myHUC = d3.select("#huc14").style("opacity","1")
                } else if (birthHUC == 15) {
                    myHUC = d3.select("#huc15").style("opacity","1")
                } else if (birthHUC == 16) {
                    myHUC = d3.select("#huc16").style("opacity","1")
                } else if (birthHUC == 17) {
                    myHUC = d3.select("#huc17").style("opacity","1")
                } else if (birthHUC == 18) {
                    myHUC = d3.select("#huc18").style("opacity","1")
                } else if (birthHUC == 19) {
                    myHUC = d3.select("#huc19").style("opacity","1")
                } else if (birthHUC == 20) {
                    myHUC = d3.select("#huc20").style("opacity","1")
                } else if (birthHUC == 21) {
                    myHUC = d3.select("#huc21").style("opacity","1")
                } 
            }
            
            highlightBirthHUC(birthHUC);
            getRivers(birthHUC);
            spitItOut(birthHUC);


    
        })
        
    });

    
}



/////////////////////////////////
// Function is called when the "submit" button is clicked
//////////////////////////////////

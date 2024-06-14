import nedb from 'nedb-promises';

const db = new nedb({ filename: "menu.db", autoload: true });

const initializeMenu = async () => {
  const initialMenu = {
    menu: [
      { id: 1, title: "Bryggkaffe", desc: "Bryggd på månadens bönor.", price: 39 },
      { id: 2, title: "Caffè Doppio", desc: "Bryggd på månadens bönor.", price: 49 },
      { id: 3, title: "Cappuccino", desc: "Bryggd på månadens bönor.", price: 49 },
      { id: 4, title: "Latte Macchiato", desc: "Bryggd på månadens bönor.", price: 49 },
      { id: 5, title: "Kaffe Latte", desc: "Bryggd på månadens bönor.", price: 54 },
      { id: 6, title: "Cortado", desc: "Bryggd på månadens bönor.", price: 39 }
    ]
  };

  const existingMenu = await db.findOne({});
  if (!existingMenu) {
		console.log("Initializing menu...");
    await db.insert(initialMenu);
  } else {
		console.log("Menu already initialized");
	}
};

const getMenu = async () => {
  const menu = await db.findOne({});
  return menu;
};

export { initializeMenu, getMenu };
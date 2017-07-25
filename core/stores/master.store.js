import { observable, action } from 'mobx'

import { gameStore } from './game.store';
import { menuStore } from './menu.store';

class MasterStore {
	constructor() {
		this.gameStore = gameStore;
		this.menuStore = menuStore;
	}
}


const masterStore = new MasterStore()
export default masterStore
import { action, observable } from 'mobx';

class MenuStore {

	isSideMenuOpen = observable({value:false});

	@action toggleSideMenu() {
		this.isSideMenuOpen.value = !this.isSideMenuOpen.value;
	}

	@action onSideMenuChange(isOpen) {
		this.isSideMenuOpen.value = isOpen;
	}

}

export const menuStore = new MenuStore();

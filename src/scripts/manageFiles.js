export let user = {
	passwdHash: "",
	_data: null,
	get data() {
		return this._data;
	},
	//TODO make sure data file dosnt go back in time when flooded
	set data(value) {
		this._data = value;
		window.manageFiles.writeUserData(this._data, this.passwdHash);
	},
	loadData: async function () {
		this._data = await window.manageFiles.getUserData(this.passwdHash);
	},
	writeData: async function () {
		window.manageFiles.writeUserData(this._data, this.passwdHash);
	},
};

export let userData = null;

window.manageFiles.getUserData((data) => {
	userData = data;
});

export async function writeUserData(data) {
	await window.manageFiles.writeUserData()(data);
}

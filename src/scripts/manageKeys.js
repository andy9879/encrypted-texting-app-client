export async function createKeyPair(hash) {
	return await window.manageKeys.createKeyPair(hash);
}

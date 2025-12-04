import { useServerDataStore } from "@/stores/serverData";
import { refreshToken as refreshTokenReq } from "@/scripts/serverApi";
import { refreshTokenHeader } from "@/scripts/socket";
import { checkPreKeyBundles } from "@/scripts/manageKeys";

const tokenRefreshMin = 4;

let EnableRefresh = false;

export { EnableRefresh as enableRefresh };

export async function refreshTokenTimer() {
	let serverData = useServerDataStore();
	setInterval(
		async () => {
			if (!EnableRefresh) return;
			//TODO add retry refresh token
			let { jwt, refreshToken } = await refreshTokenReq();

			serverData.jwt = jwt;
			serverData.refreshToken = refreshToken;
			refreshTokenHeader(jwt);
			checkPreKeyBundles();
		},
		tokenRefreshMin * 60 * 1000,
	);
}

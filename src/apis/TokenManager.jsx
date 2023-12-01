import jwt_decode from "jwt-decode";

const userData = {
    accessToken: undefined,
    claims: undefined
}

const TokenManager = {
    getAccessToken: () => userData.accessToken,
    getClaims: () => {
        if (!userData.claims) {
            return undefined;
        }

        // Check if the access token is expired
        if (TokenManager.isTokenExpired(userData.accessToken)) {
            TokenManager.clear();
            return undefined;
        }

        return userData.claims;
    },
    setAccessToken: (token) => {
        userData.accessToken = token;
        const claims = jwt_decode(token);
        userData.claims = claims;
        sessionStorage.setItem("accessToken", token);
        sessionStorage.setItem("claims", JSON.stringify(claims));
        return claims;
    },
    clear: () => {
        userData.accessToken = undefined;
        userData.claims = undefined;
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("claims");
    },
    isTokenExpired: (token) => {
        try {
            const decoded = jwt_decode(token);
            if (decoded.exp < Date.now() / 1000) {
                return true;
            }
            return false;
        } catch (error) {
            // Handle decoding error
            return true;
        }
    }
}

export default TokenManager;

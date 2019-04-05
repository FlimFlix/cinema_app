export const LOGOUT = "LOGOUT";

// с выходом всё проще, т.к. он не делает запросов.
export const logout = () => {
    return {type: LOGOUT}
};
const roles = ["admin", "dealer"];

//* User Authorization
const roleRights = new Map();

//! Defining rights for each role
//? User role with no specific rights
roleRights.set(roles[0], ["getdealers"]);
//? Admin role with specific rights
roleRights.set(roles[1], []);

module.exports = {
	roles,
	roleRights,
};

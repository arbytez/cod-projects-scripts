exports.hasPermission = (user, permissionsNeeded) => {
  if (!user || !user.roles) return false;
  const matchedPermissions = user.roles.filter(permissionTheyHave =>
    permissionsNeeded.includes(permissionTheyHave)
  );
  return matchedPermissions.length;
};

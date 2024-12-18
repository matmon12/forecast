import { AbilityBuilder, createMongoAbility } from "@casl/ability";

export const ability = createMongoAbility();

export const defineAbilityFor = (role) => {
  const { rules, can, cannot } = new AbilityBuilder(createMongoAbility);

  switch (role) {
    case "GUEST":
      cannot("logout");
      // rating
      cannot("update", "rating");
      // post
      cannot("delete", "Post");  // кнопки / функции
      cannot("create", "Post"); // кнопки / функции
      cannot("update", "Post"); // кнопки / функции
      // user
      cannot("read", "User");
      cannot("update", "User");
      // pages
      can("visit", "SignUp");
      can("visit", "SignIn");
      cannot("visit", "Profile");
      cannot("visit", "Dashboard");
      break;
    case "USER":
      can("logout");
      // rating
      can("update", "rating");
      // post
      cannot("delete", "Post");
      cannot("create", "Post");
      cannot("update", "Post");
      // user
      can("read", "User");
      can("update", "User");
      // pages
      cannot("visit", "SignUp");
      cannot("visit", "SignIn");
      can("visit", "Profile");
      cannot("visit", "Dashboard");
      break;
    case "MODERATOR":
      can("logout");
      // rating
      can("update", "rating");
      // post
      cannot("delete", "Post");
      cannot("create", "Post");
      cannot("update", "Post");
      // user
      can("read", "User");
      can("update", "User");
      // pages
      cannot("visit", "SignUp");
      cannot("visit", "SignIn");
      can("visit", "Profile");
      can("visit", "Dashboard");
      break;
    case "ADMIN":
      can("logout");
      // rating
      can("update", "rating");
      // post
      can("delete", "Post");
      can("create", "Post");
      can("update", "Post");
      // user
      can("read", "User");
      can("update", "User");
      // pages
      cannot("visit", "SignUp");
      cannot("visit", "SignIn");
      can("visit", "Profile");
      can("visit", "Dashboard");
      break;
    default:
      break;
  }

  return rules;
};

ability.update(defineAbilityFor("GUEST"));

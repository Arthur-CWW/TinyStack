import { Category } from '@prisma/client';
import { faker } from '@faker-js/faker';
import Decimal from 'decimal.js';



export function fakeAccount() {
  return {
    type: faker.lorem.words(5),
    provider: faker.lorem.words(5),
    providerAccountId: faker.lorem.words(5),
    refresh_token: undefined,
    access_token: undefined,
    expires_at: undefined,
    token_type: undefined,
    scope: undefined,
    id_token: undefined,
    session_state: undefined,
  };
}
export function fakeAccountComplete() {
  return {
    id: faker.string.uuid(),
    userId: faker.string.uuid(),
    type: faker.lorem.words(5),
    provider: faker.lorem.words(5),
    providerAccountId: faker.lorem.words(5),
    refresh_token: undefined,
    access_token: undefined,
    expires_at: undefined,
    token_type: undefined,
    scope: undefined,
    id_token: undefined,
    session_state: undefined,
  };
}
export function fakeSession() {
  return {
    sessionToken: faker.lorem.words(5),
    expires: faker.date.anytime(),
  };
}
export function fakeSessionComplete() {
  return {
    id: faker.string.uuid(),
    sessionToken: faker.lorem.words(5),
    userId: faker.string.uuid(),
    expires: faker.date.anytime(),
  };
}
export function fakeVerificationToken() {
  return {
    identifier: faker.lorem.words(5),
    token: faker.lorem.words(5),
    expires: faker.date.anytime(),
  };
}
export function fakeVerificationTokenComplete() {
  return {
    identifier: faker.lorem.words(5),
    token: faker.lorem.words(5),
    expires: faker.date.anytime(),
  };
}
export function fakeTag() {
  return {
    name: faker.person.fullName(),
  };
}
export function fakeTagComplete() {
  return {
    id: faker.number.int(),
    name: faker.person.fullName(),
  };
}
export function fakeComment() {
  return {
    content: faker.lorem.words(5),
    updatedAt: faker.date.anytime(),
  };
}
export function fakeCommentComplete() {
  return {
    id: faker.number.int(),
    content: faker.lorem.words(5),
    createdAt: new Date(),
    updatedAt: faker.date.anytime(),
    postId: faker.number.int(),
    authorId: faker.string.uuid(),
    replyId: undefined,
  };
}
export function fakeLikeComplete() {
  return {
    id: faker.number.int(),
    commentId: faker.number.int(),
    userId: faker.string.uuid(),
  };
}
export function fakeUser() {
  return {
    coverImage: undefined,
    name: undefined,
    email: undefined,
    emailVerified: undefined,
    image: undefined,
    bio: undefined,
  };
}
export function fakeUserComplete() {
  return {
    id: faker.string.uuid(),
    coverImage: undefined,
    name: undefined,
    email: undefined,
    emailVerified: undefined,
    image: undefined,
    bio: undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
export function fakePost() {
  return {
    title: faker.lorem.words(5),
    subtitle: undefined,
    content: faker.lorem.words(5),
    category: faker.helpers.arrayElement([Category.Technology, Category.HealthWellness, Category.PersonalFinance, Category.FoodCooking, Category.Travel, Category.FashionBeauty, Category.Lifestyle, Category.ParentingFamily, Category.BusinessEntrepreneurship, Category.DIYCrafts, Category.EducationLearning, Category.EntertainmentPopCulture, Category.SportsFitness, Category.PoliticsSocialIssues, Category.Gaming, Category.HomeGarden, Category.None] as const),
    coverImage: undefined,
  };
}
export function fakePostComplete() {
  return {
    id: faker.number.int(),
    title: faker.lorem.words(5),
    subtitle: undefined,
    content: faker.lorem.words(5),
    createdAt: new Date(),
    updatedAt: new Date(),
    published: false,
    authorId: faker.string.uuid(),
    category: faker.helpers.arrayElement([Category.Technology, Category.HealthWellness, Category.PersonalFinance, Category.FoodCooking, Category.Travel, Category.FashionBeauty, Category.Lifestyle, Category.ParentingFamily, Category.BusinessEntrepreneurship, Category.DIYCrafts, Category.EducationLearning, Category.EntertainmentPopCulture, Category.SportsFitness, Category.PoliticsSocialIssues, Category.Gaming, Category.HomeGarden, Category.None] as const),
    coverImage: undefined,
  };
}

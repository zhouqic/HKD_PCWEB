import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const NameKey = 'Admin-Name'
const StaffRoleKey = 'Admin-StaffRole'
const JobNumberKey = 'Admin-JobNumber'
const ShopKey = 'Admin-Shop'
const ShopIdKey = 'Admin-ShopId'
const IndustryIdKey = 'Admin-industryId'
const ShopTypeKey = 'Admin-ShopType'
const AvatarKey = 'Admin-Avatar'
const CreaterIdKey = 'Admin-CreaterId'
const StaffIdKey = 'Admin-StaffId'
const VoiceTypeKey = 'Admin-VoiceType'
const RoleIdKey = 'Admin-RoleId'
const TelKey = 'Admin-Tel'


export function getIndustryId() {
  return Cookies.get(IndustryIdKey)
}

export function setIndustryId(id) {
  return Cookies.set(IndustryIdKey, id)
}

export function getShopId() {
  return Cookies.get(ShopIdKey)
}

export function setShopId(ShopId) {
  return Cookies.set(ShopIdKey, ShopId)
}

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getShopType() {
  return Cookies.get(ShopTypeKey)
}

export function setShopType(type) {
  return Cookies.set(ShopTypeKey, type)
}

export function getRoleId() {
  return Cookies.get(RoleIdKey)
}

export function setRoleId(id) {
  return Cookies.set(RoleIdKey, id)
}

export function getName() {
  return Cookies.get(NameKey)
}

export function setName(name) {
  return Cookies.set(NameKey, name)
}

export function removeName() {
  return Cookies.remove(NameKey)
}

export function getTel() {
  return Cookies.get(TelKey)
}

export function setTel(tel) {
  return Cookies.set(TelKey, tel)
}

export function removeTel() {
  return Cookies.remove(TelKey)
}

export function getStaffRole() {
  return Cookies.get(StaffRoleKey)
}

export function setStaffRole(staffRole) {
  return Cookies.set(StaffRoleKey, staffRole)
}

export function removeStaffRole() {
  return Cookies.remove(StaffRoleKey)
}

export function getJobNumber() {
  return Cookies.get(JobNumberKey)
}

export function setJobNumber(jobNumber) {
  return Cookies.set(JobNumberKey, jobNumber)
}

export function removeJobNumber() {
  return Cookies.remove(JobNumberKey)
}

export function getShop() {
  return Cookies.get(ShopKey)
}

export function setShop(shop) {
  return Cookies.set(ShopKey, shop)
}

export function removeShop() {
  return Cookies.remove(ShopKey)
}

export function getAvatar() {
  return Cookies.get(AvatarKey)
}

export function setAvatar(shop) {
  return Cookies.set(AvatarKey, shop)
}

export function removeAvatar() {
  return Cookies.remove(AvatarKey)
}

export function getCreaterId() {
  return Cookies.get(CreaterIdKey)
}

export function setCreaterId(shop) {
  return Cookies.set(CreaterIdKey, shop)
}

export function removeCreaterId() {
  return Cookies.remove(CreaterIdKey)
}

export function getStaffId() {
  return Cookies.get(StaffIdKey)
}

export function setStaffId(shop) {
  return Cookies.set(StaffIdKey, shop)
}

export function removeStaffId() {
  return Cookies.remove(StaffIdKey)
}

export function getVoiceType() {
  return Cookies.get(VoiceTypeKey)
}

export function setVoiceType(shop) {
  return Cookies.set(VoiceTypeKey, shop)
}

export function removeVoiceType() {
  return Cookies.remove(VoiceTypeKey)
}
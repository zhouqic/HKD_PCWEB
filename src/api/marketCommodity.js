import request from '@/utils/request'

// 商品分类列表
export function getProductList(data)　{
    return request({
        url: '/api/hkd-portal/jzShopProductClassController/findProductClassByPage',
        method: 'post',
        data
    })
}
// 商品分类列表
export function getProductListAsync(data)　{
    return request({
        url: '/api/hkd-portal/jzShopProductClassController/findProductClass',
        method: 'post',
        data
    })
}
// 获取单个商品分类
export function getProduct(data)　{
    return request({
        url: '/api/hkd-portal/jzShopProductClassController/findProductClassById',
        method: 'post',
        data
    })
}
// 获取是否开启会员卡设置会员价
export function flagShopCard() {
  return request({
    url: '/api/hkd-portal/jzShopProductController/flagShopCard',
    method: 'post',
    data: {}
  })
}
// 新增、编辑商品分类
export function saveProduct(data)　{
    return request({
        url: '/api/hkd-portal/jzShopProductClassController/saveProductClassById',
        method: 'post',
        data,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}
// 删除商品分类
export function deleteProduct(data)　{
    return request({
        url: '/api/hkd-portal/jzShopProductClassController/delProductById',
        method: 'post',
        data
    })
}
// 根据名字和父级id判断是否名称已存在
export function findProductName(data)　{
    return request({
        url: '/api/hkd-portal/jzShopProductClassController/findClassByNameAndParentId',
        method: 'post',
        data
    })
}

//规格模板
// 获取规格模板列表
export function getProductModelList(data)　{
    return request({
        url: '/api/hkd-portal/jzShopProductModelController/findProductModelByPage',
        method: 'post',
        data
    })
}
// 获取单个规格模板列表
export function getProductModel(data)　{
    return request({
        url: '/api/hkd-portal/jzShopProductModelController/findProductModelById',
        method: 'post',
        data
    })
}
// 新增/编辑规格模板列表
export function saveProductModel(data)　{
    return request({
        url: '/api/hkd-portal/jzShopProductModelController/saveProductModelById',
        method: 'post',
        data
    })
}
// 删除规格模板
export function deleteProductModel(data)　{
    return request({
        url: '/api/hkd-portal/jzShopProductModelController/delProductModelById',
        method: 'post',
        data
    })
}

// 商品管理
// 获取商品列表
export function getProductByPage(data)　{
    return request({
        url: '/api/hkd-portal/jzShopProductController/findProductByPage',
        method: 'post',
        data
    })
}

// 图片上传
export function saveImages(data)　{
    return request({
        url: '/api/hkd-portal/jzShopProductController/saveImages',
        method: 'post',
        data,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

// 新增商品
export function addProduct(data)　{
    return request({
        url: '/api/hkd-portal/jzShopProductController/addProduct',
        method: 'post',
        data,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}
// 获取单个商品详情
export function getProductById(data)　{
    return request({
        url: '/api/hkd-portal/jzShopProductController/findProductById',
        method: 'post',
        data
    })
}
// 下架商品
export function deleteProductByPage(data)　{
    return request({
        url: '/api/hkd-portal/jzShopProductController/delProductById',
        method: 'post',
        data
    })
}
// 新增商品上传图片
export function saveProductImages(data)　{
    return request({
        url: '/api/hkd-portal/jzShopProductController/saveImages',
        method: 'post',
        data,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

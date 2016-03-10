/**
 * @author luxueyan
 */
;
(function() {
    'use strict';
    angular.module('kt.pano.i18', [])

    .value('ktFameLocaleTexts', {
        asset: {
            //资产字段
            name: '资产名称',
            identifier: '资产编号',
            published_at: '资产发布时间',
            type: '类型',
            amount: '规模',
            duration: '期限',
            due_at: '至',
            directive_rate: '指导价',
            value_at: '预计发行时间',
            instalment: '是否可分期',
            repayment: '还款方式',
            min_amount: '最小认购金额',
            guarantees: '增信方式',
            description: '资产亮点',
            structure_images: '交易结构图',
            status: '产品状态',
            attachments: '更多资料',
            salesmen: '商务负责人',
            users: '项目负责人',
            user: {
                name: '姓名',
                mobile: '电话',
                email: '邮箱'
            },
            salesman: {
                name: '姓名',
                mobile: '电话',
                email: '邮箱',
            },
            other: {
                no_assets: '没有记录！',
                instalment_true: '是',
                instalment_false: '否',
                asset_detail_link: '详情',
                asset_finished: '预约结束',
                asset_release: '预约中',
                no_attachments: '无更多资料',
                asset_detail: '资产介绍',
                download_tips: '请致电业务联系人获取下载权限'
            }
        },
        product: {
            //资产字段
            exchange_name: '交易所',
            type: '产品类型',
            asset_name: '资产名称',
            name: '产品名称',
            amount: '申购金额',
            allocated_amount: '确认金额',
            subscription_value: '实际募集规模',
            sale_rate: '申购率',
            annual_rate: '产品收益率',
            duration: '产品期限',
            value_at: '起息日',
            due_at: '到期日',
            remaining_days: '剩余期限',
            salesmen: '商务负责人',
            salesman: {
                name: '姓名',
                mobile: '电话',
                email: '邮箱',
            },
            users: '项目负责人',
            user: {
                name: '姓名',
                mobile: '电话',
                email: '邮箱'
            },
            attachments: '更多资料',

            other: {
                no_products: '没有记录！',
                product_detail_link: '详情',
                product_operations: '操作',
                product_finished: '预约结束',
                product_release: '预约中',
                no_attachments: '无更多资料',
                product_detail: '详细信息',
                download_tips: '请致电业务联系人获取下载权限'
            }
        },
    })
})();

/**
 * @author luxueyan
 */
;
(function() {
    'use strict';
    angular.module('kt.pano')
        .factory('ktDataHelper', function() {
            return {
                // 筛选组件更新active状态
                filterInit: function(filters, types) {
                    this._dataAdaptor(filters, types)
                    return function(params) {
                        _.each(filters || [], function(v) {
                            if (params[v.value]) {
                                _.each(v.options, function(o) {
                                    o.active = o.value == params[v.value]
                                })
                            }
                        })
                    }
                },
                getConditionName: function(filters) {
                    return function(type) {
                        var filter = _.find(filters, function(v) {
                            return v.value === type
                        }) || {}

                        var condition = _.find(filter.options || [], function(o) {
                            return o.active
                        })

                        if (condition) {
                            return condition.name
                        }

                    }
                },
                cutDirtyParams: function(params) {
                    var newParams = $.extend(true, {}, params)
                    _.each(newParams, function(v, i) {
                        if (newParams[i] === 'all')
                            delete newParams[i]
                    })
                    return newParams
                },
                _dataAdaptor: function(filters, types) {
                    _.each(filters, function(v, i) {
                        v.type = $.isArray(types) ? types[i] : 'list'
                        v.options = _.map(v.options, function(o) {
                            return {
                                name: o[0],
                                value: o[1]
                            }
                        })
                        v.options.unshift({
                            name: '全部',
                            active: true,
                            value: 'all'
                        })
                    })
                }
            }

        })

})();

(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-0c7cc44a"],{"10cc":function(e,t,a){"use strict";var n=a("9f12"),l=a("53fe"),r=a("8b83"),o=a("c65a"),i=a("c03e"),u=a("9ab4"),c=a("60a3"),s=function(e){function t(){var e;return Object(n.a)(this,t),(e=Object(r.a)(this,Object(o.a)(t).apply(this,arguments))).form={name:"",supplierName:""},e}return Object(i.a)(t,e),Object(l.a)(t,[{key:"handleSearch",value:function(){return this.$emit("search"),Object.assign({},this.value,this.form,{pageNum:1})}}]),t}(c.h);u.a([Object(c.e)({type:Array,default:function(){return[]}})],s.prototype,"queryData",void 0),u.a([Object(c.d)("input",{type:Object,default:function(){return{}}})],s.prototype,"value",void 0),u.a([Object(c.b)("input")],s.prototype,"handleSearch",null);var p=s=u.a([Object(c.a)({name:"FormSearch"})],s),d=a("2877"),b=Object(d.a)(p,(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("el-form",{attrs:{inline:!0,model:e.form,size:"small"}},[a("el-form-item",{attrs:{label:"名称"}},[a("el-input",{attrs:{clearable:""},model:{value:e.form.name,callback:function(t){e.$set(e.form,"name",t)},expression:"form.name"}})],1),a("el-form-item",{attrs:{label:"供应商"}},[a("el-select",{attrs:{clearable:""},model:{value:e.form.supplierName,callback:function(t){e.$set(e.form,"supplierName",t)},expression:"form.supplierName"}},e._l(e.queryData,(function(e,t){return a("el-option",{key:t,attrs:{label:e.name,value:e.name}})})),1)],1),a("el-form-item",[a("el-button",{attrs:{type:"primary"},on:{click:e.handleSearch}},[e._v("搜索")])],1)],1)}),[],!1,null,null,null);t.a=b.exports},"4f97":function(e,t,a){"use strict";a.d(t,"b",(function(){return n})),a.d(t,"a",(function(){return l}));var n={type:[{label:"现金卡",value:1},{label:"充值卡",value:2},{label:"兑换卡",value:3}],constType:[{label:"现金卡",value:"CASH"},{label:"充值卡",value:"CHARGE"},{label:"兑换卡",value:"EXCHANGE"}],status:[{label:"未激活",value:0},{label:"已激活",value:1},{label:"已使用",value:2},{label:"已过期",value:99}],useStatus:[{label:"未兑换",value:0},{label:"已兑换",value:1}]},l={status:[{label:"待付款",value:0},{label:"待发货",value:1},{label:"待收货",value:2},{label:"已完成",value:3},{label:"已关闭",value:4}],express:[{label:"已揽收",value:1},{label:"在途中",value:2},{label:"到达派件城市",value:201},{label:"签收",value:3}],abnormalStatus:[{label:"无轨迹",value:0},{label:"问题件",value:4}]}},"72d8":function(e,t,a){"use strict";var n=a("9e60");a.n(n).a},"9e60":function(e,t,a){},ae85:function(e,t,a){"use strict";var n=a("9f12"),l=a("53fe"),r=a("8b83"),o=a("c65a"),i=a("c03e"),u=a("9ab4"),c=a("60a3"),s=function(e){function t(){return Object(n.a)(this,t),Object(r.a)(this,Object(o.a)(t).apply(this,arguments))}return Object(i.a)(t,e),Object(l.a)(t,[{key:"handleDel",value:function(e){var t=this;this.$confirm("确定删除该内容？","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){t.$emit("del",e)}))}},{key:"handleView",value:function(e){this.$emit("view",e)}},{key:"handleAdd",value:function(){this.$emit("add")}},{key:"handleEdit",value:function(){this.$emit("edit")}}]),t}(c.h);u.a([Object(c.f)("params",{type:Object,default:function(){}})],s.prototype,"props",void 0),u.a([Object(c.e)({type:Boolean,default:!1})],s.prototype,"onlyView",void 0),u.a([Object(c.e)({type:Boolean,default:!1})],s.prototype,"selection",void 0),s=u.a([c.a],s),t.a=s},e6e2:function(e,t,a){"use strict";a.r(t),a("96cf");var n=a("89ba"),l=a("9f12"),r=a("53fe"),o=a("8b83"),i=a("c65a"),u=a("c03e"),c=a("9ab4"),s=a("60a3"),p=a("10cc"),d=a("ae85"),b=a("4f97"),f=function(e){function t(){var e;return Object(l.a)(this,t),(e=Object(o.a)(this,Object(i.a)(t).apply(this,arguments))).dictTicket=b.b,e}return Object(u.a)(t,e),t}(Object(s.c)(d.a)),m=f=c.a([Object(s.a)({components:{FormSearch:p.a},mixins:[d.a],name:"TableList"})],f),h=(a("72d8"),a("2877")),v=Object(h.a)(m,(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("slw-table",e._g(e._b({ref:"table",attrs:{"show-selection":e.selection}},"slw-table",e.$attrs,!1),e.$listeners),[a("template",{slot:"query"},[e._t("default")],2),a("template",{slot:"button"},[e.onlyView?e._e():a("el-button",{attrs:{type:"primary",size:"small"},on:{click:function(t){return e.$emit("add")}}},[e._v("添加商品")])],1),a("el-table-column",{attrs:{prop:"name",label:"图片"},scopedSlots:e._u([{key:"default",fn:function(e){return a("el-image",{staticClass:"global__img--thumb",attrs:{fit:"contain",src:e.row.coverImage}},[a("i",{staticClass:"el-icon-picture-outline",attrs:{slot:"error"},slot:"error"})])}}])}),a("el-table-column",{attrs:{label:"名称"},scopedSlots:e._u([{key:"default",fn:function(t){return e.onlyView?a("span",[e._v(e._s(t.row.name))]):a("el-button",{attrs:{type:"text"},on:{click:function(a){return e.$emit("view",t.row)}}},[e._v(e._s(t.row.name))])}}],null,!0)}),a("el-table-column",{attrs:{label:"规格",prop:"specification"}}),a("el-table-column",{attrs:{label:"单价"},scopedSlots:e._u([{key:"default",fn:function(t){return a("div",{staticClass:"table__money"},[e._v(" "+e._s(e._f("formatMoney")(t.row.price))+" ")])}}])}),a("el-table-column",{attrs:{label:"供应商",prop:"supplierName"}}),a("el-table-column",{attrs:{label:"编号",prop:"no"}}),e.onlyView?e._e():a("el-table-column",{attrs:{label:"操作"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-tooltip",{attrs:{effect:"dark",content:"编辑"}},[a("el-button",{attrs:{icon:"el-icon-edit",size:"mini",type:"success",plain:""},on:{click:function(a){return e.$emit("edit",t.row)}}})],1),a("el-tooltip",{attrs:{effect:"dark",content:"删除"}},[a("el-button",{attrs:{type:"danger",plain:"",icon:"el-icon-delete",size:"mini"},on:{click:function(a){return e.handleDel(t.row)}}})],1)]}}],null,!1,2254268940)})],2)}),[],!1,null,"eda2bd92",null).exports,y=function(e){function t(){var e;return Object(l.a)(this,t),(e=Object(o.a)(this,Object(i.a)(t).apply(this,arguments))).params={pageNum:1,pageSize:10},e.loading=!1,e.data={},e.queryData=[],e}var a,c,s;return Object(u.a)(t,e),Object(r.a)(t,[{key:"hanldeFetchData",value:(s=Object(n.a)(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return this.loading=!0,e.next=3,this.$ajax.ajax({method:"GET",url:"v1/goods",query:this.params});case 3:this.data=e.sent,this.loading=!1;case 5:case"end":return e.stop()}}),e,this)}))),function(){return s.apply(this,arguments)})},{key:"created",value:(c=Object(n.a)(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.$ajax.ajax({method:"GET",url:"v1/goods/suppliers",query:{pageSize:100}});case 2:this.queryData=e.sent;case 3:case"end":return e.stop()}}),e,this)}))),function(){return c.apply(this,arguments)})},{key:"handleGoDetail",value:function(e){var t=e.id;this.$router.push({path:"/product/detail/".concat(t)})}},{key:"handleEditProduct",value:function(e){var t=e.id;this.$router.push({path:"/product/edit/".concat(t)})}},{key:"handleDel",value:(a=Object(n.a)(regeneratorRuntime.mark((function e(t){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.$ajax.ajax({method:"DELETE",url:"v1/goods/".concat(t.id)});case 2:if(e.sent)return e.next=6,this.hanldeFetchData();e.next=8;break;case 6:e.next=9;break;case 8:this.$notify.error({title:"提示",message:"删除失败"});case 9:case"end":return e.stop()}}),e,this)}))),function(e){return a.apply(this,arguments)})},{key:"handleAddProduct",value:function(){this.$router.push({path:"/product/edit"})}}]),t}(s.h),j=y=c.a([Object(s.a)({name:"ProductIndex",components:{TableList:v,FormSearch:p.a}})],y),O=Object(h.a)(j,(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],staticClass:"product"},[a("table-list",{attrs:{"del-tip":"确定要删除该商品吗？",data:e.data},on:{add:e.handleAddProduct,view:e.handleGoDetail,edit:e.handleEditProduct,fetch:e.hanldeFetchData,del:e.handleDel},model:{value:e.params,callback:function(t){e.params=t},expression:"params"}},[a("form-search",{attrs:{"query-data":e.queryData},on:{search:function(t){e.data={}}},model:{value:e.params,callback:function(t){e.params=t},expression:"params"}})],1)],1)}),[],!1,null,null,null);t.default=O.exports}}]);
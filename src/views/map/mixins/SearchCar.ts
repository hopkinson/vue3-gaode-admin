import { Component, Vue, Watch } from 'vue-property-decorator'
import { CompanyBody } from '@/services'
@Component
export default class Table extends Vue {
  showSearch: boolean = false // 是否显示筛选
  companyList: Array<CompanyBody> = [] // 所有单位信息
  searchCarBody = {} // 搜索的车辆列表
  carParams = {
    pageNum: '',
    pageNo: 10,
    companyId: '',
    carNo: ''
  }
  // 搜索汽车
  handleSearchCar(carNo) {
    this.carParams = Object.assign({}, this.carParams, {
      carNo,
      pageNum: 0
    })
  }
  // 改变搜索条件
  handleChangeFilter(form) {
    this.carParams = Object.assign({}, this.carParams, {
      ...form,
      pageNum: 0
    })
  }
  // 改变当前页
  handleCurrentChange(pageNum) {
    this.carParams = Object.assign({}, this.carParams, {
      pageNum
    })
  }
  // 所有单位信息
  async handleSearchCompany() {
    return await this.$ajax.ajax({
      method: 'GET',
      url: 'v1/car/company'
    })
  }

  // 监听 - 是否显示筛选
  @Watch('showSearch', {})
  public async watchShowSearch(val: boolean) {
    if (val && !this.companyList.length) {
      // 所有单位信息
      this.companyList = await this.$ajax.ajax({
        method: 'GET',
        url: 'v1/company'
      })
      this.carParams.pageNum = '0'
    }
  }

  @Watch('carParams', { deep: true })
  public async watchCarParams(val) {
    // 车辆列表
    const carBody = await this.$ajax.ajax({
      method: 'POST',
      url: 'v1/cars',
      query: val,
      data: val
    })
    this.searchCarBody = carBody
  }
}

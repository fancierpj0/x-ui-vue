<template>
    <div :class="datePickerClass">
        <Popover ref="popover" position="bottom" :class="popoverClass" :content-wrapper-class-name="contentWrapperClass">
            <!-- ↓Popoverのtrigger:default插槽 -->
            <Input type="text"
               :value="formattedvalue"
               @input="onInput"
               @blur="onBlur"
               ref="input"/>

            <!-- Popoverのcontent插槽 -->
            <template slot="content">
                <div :class="popoverContentClass" @selectstart.prevent>
                    <!--nav弹出层title
                        《 < 2019年9月 > 》
                    -->
                    <div :class="navClass">
                        <span :class="prevYearClass" @click="onClickPrevYear"><Icon name="arrow-forward-left"></Icon></span>
                        <span :class="prevMonthClass" @click="onClickPrevMonth"><Icon name="left"></Icon></span>
                        <div :class="yearAndMonthClass">
                            <div :class="yearClass">
                                <span v-show="!showYearInput" @click="onClickYear">{{display.year}}</span>
                                <Input v-show="showYearInput" ref="year" :value="display.year" @input="onInputYear" @blur="showYearInput=false" no-form-emit/>
                                年
                            </div>
                            <div :class="monthClass">
                                <span v-show="!showMonthInput" @click="onClickMonth">{{month}}</span>
                                <Input v-show="showMonthInput" ref="month" :value="month" @input="onInputMonth" @blur="showMonthInput=false" no-form-emit/>
                                月
                            </div>
                        </div>
                        <span :class="nextMonthClass" @click="onClickNextMonth"><Icon name="right"></Icon></span>
                        <span :class="nextYearClass" @click="onClickNextYear"><Icon name="arrow-forward-right"></Icon></span>
                    </div>
                    <!--panel-->
                    <div :class="panelClass">
                        <!--
                                一 二 三 四 五 六 日
                            -->
                        <div :class="weekdaysClass">
                            <span :class="weekdayClass" v-for="i in [1,2,3,4,5,6,0]" :key="i">
                                {{weekdays[i]}}
                            </span>
                        </div>
                        <!--
                            除去星期几的那一行
                            日期以6(row) x 7(col) 显示
                        -->
                        <div :class="rowClass" v-for="i in 6" :key="i">
                            <span :class="[cellClass,{currentMonth:isCurrentMonth(getVisibleDay(i,j)),selected:isSelected(getVisibleDay(i,j)),today:isToday(getVisibleDay(i,j)) }]"
                                v-for="j in 7"
                                :key="j"
                                @click="onClickCell(getVisibleDay(i,j))">
                                {{getVisibleDay(i,j).getDate()}}
                            </span>
                        </div>
                    </div>
                    <!--底部按钮-->
                    <div :class="actionsClass">
                        <ButtonGroup size="small">
                            <Button @click="onClickToday" size="small">今天</Button>
                            <Button @click="onClickClear" size="small">清除</Button>
                        </ButtonGroup>
                    </div>
                </div>
            </template>
        </Popover>
    </div>
</template>

<script>
  import Input from '../Input';
  import Icon from '../Icon';
  import Popover from '../Popover';
  import Button from '../Button';
  import ButtonGroup from '../Button/ButtonGroup';
  import helper from './helper';
  import {UI_PREFIX,FORM_EVENTBUS} from "../constant";

  export default {
    name: "Datepicker"
    ,components:{Input,Icon,Popover,Button,ButtonGroup}
    ,inject:{
      [FORM_EVENTBUS]:{from:FORM_EVENTBUS,default:null}
      ,field:{from:'field', default: null}
    }
    ,props:{
      firstDayOfWeek:{type:Number}
      ,value:{type:Date /* ,default:()=>new Date()*/}
      ,scope:{type:Array /* 如果只有一个参数 直接 new Date(数字) 这个数字是毫秒数 而不是年份 */
        , default: () => [new Date(1900,0,1), helper.addYear(new Date(), 100)]}
    }
    ,data(){
      let [year, month] = helper.getYearMonthDate(this.value||new Date());
      return {
        weekdays:['日','一','二','三','四','五','六']
        ,display:{year,month} // 要展示的当前页面的日期并不一定是当前年月日的日期
        ,showYearInput:false
        ,showMonthInput:false
      }
    }
    ,computed:{
      /*
        array
        日历当前页展示的所有日期，共42个
      */
      visibleDays(){
        const date = new Date(this.display.year, this.display.month, 1);
        const first = helper.firstDayOfMonth(date);
        const array = [];

        /*
            getDay() 0 表示星期天 1表示星期1

             一 二 三 四 五 六 日
                               1  ← 如果这月第一天是周日，就要向前补6天
        */
        const offsetToTableFirstItem = first.getDay() === 0 ? 6 : first.getDay() - 1;
        const x = first - offsetToTableFirstItem * 3600 * 24 * 1000; // first虽然是Date实例 但是如果参与数学运算 会被当做时间搓来操作
        for(let i=0;i<42;++i){ // 42-> 6(row) x 7(col)
          array.push(new Date(x + i * 3600 * 24 * 1000));
        }
        return array;
      }
      /*
        Date(this.value)->String(2019-09-14)
      */
      ,formattedvalue(){
        if(!this.value) return '';
        const [year,month,day] = helper.getYearMonthDate(this.value);
        return `${year}-${helper.pad2(month + 1)}-${helper.pad2(day)}`;
      }
      ,month(){
        return this.display.month + 1;
      }


      ,datePickerClass(){
        return `${UI_PREFIX}datePicker`;
      }
      ,popoverClass(){
        return `${this.datePickerClass}-popover`
      }
      ,contentWrapperClass(){
        return `${this.popoverClass}-contentWrapper`
      }

      ,popoverContentClass(){
        return `${this.contentWrapperClass}-content`
      }

      //nav
      ,navClass(){
        return `${this.popoverContentClass}-nav`;
      }
      ,prevYearClass(){
        return `${this.navClass}-prevYear`;
      }
      ,prevMonthClass(){
        return `${this.navClass}-prevMonth`;
      }
      ,nextYearClass(){
        return `${this.navClass}-nextYear`;
      }
      ,nextMonthClass(){
        return `${this.navClass}-nextMonth`;
      }
      ,yearAndMonthClass(){
        return `${this.navClass}-yearAndMonth`;
      }
      ,yearClass(){
        return `${this.navClass}-yearAndMonth-year`;
      }
      ,monthClass(){
        return `${this.navClass}-yearAndMonth-month`;
      }

      //panel
      ,panelClass(){
        return `${this.popoverContentClass}-panel`
      }
      ,weekdaysClass(){
        return `${this.panelClass}-weekdays`
      }
      ,weekdayClass(){
        return `${this.panelClass}-weekdays-weekday`
      }
      ,rowClass(){
        return `${this.panelClass}-row`
      }
      ,cellClass(){
        return `${this.rowClass}-cell`;
      }

      ,actionsClass(){
        return `${this.popoverContentClass}-actions`;
      }
    }
    ,methods:{
      /*
        42个日期中的某一个(Date实例)
     */
      getVisibleDay(row = 1, col = 1) {
        return this.visibleDays[(row - 1) * 7 + col - 1];
      }
      ,isCurrentMonth(date){
        let [y, m] = helper.getYearMonthDate(date);
        return y === this.display.year && m === this.display.month;
      }
      ,isSelected(date){
        if(!this.value) return false;
        let [y, m, d] = helper.getYearMonthDate(date);
        let [y2, m2, d2] = helper.getYearMonthDate(this.value);
        return y === y2 && m === m2 && d === d2;
      }
      ,isToday(date){
        let [y, m, d] = helper.getYearMonthDate(date);
        let [y2, m2, d2] = helper.getYearMonthDate(new Date());
        return y === y2 && m === m2 && d === d2;
      }

      /* $emit(input)和关闭弹出层 */
      ,onClickCell(date){
        if(!this.isCurrentMonth(date)) return; //TODO
        this.$emit('input', date);
        this[FORM_EVENTBUS] && this[FORM_EVENTBUS].$emit(`update:formItem`, this.field, 'change');
        this.$refs.popover.close();
      }

      // trigger
      /*
        改变this.display和$emit('input')
      */
      ,onInput(value,e){
        const reg = /^\d{4}-\d{2}-\d{2}$/g;
        if(value.match(reg)){
          let [year, month, day] = value.split('-');
          month = month - 1; //js中月份比我们生活中的月份小1
          this.display = {year:Number(year), month:Number(month)};
          this.$emit('input', new Date(year, month, day));
          this[FORM_EVENTBUS] && this[FORM_EVENTBUS].$emit(`update:formItem`, this.field, 'change');
        }
      }
      ,onBlur(){
        this.$refs.input.$refs.input.value = this.formattedvalue;
        this[FORM_EVENTBUS] && this[FORM_EVENTBUS].$emit(`update:formItem`, this.field, 'blur');
      }


      //nav
      ,onClickPrevYear(){
        const oldDate = new Date(this.display.year, this.display.month);
        const newDate = helper.addYear(oldDate, -1);
        const [year, month] = helper.getYearMonthDate(newDate);
        this.display = {year, month}
      }
      ,onClickPrevMonth(){
        const oldDate = new Date(this.display.year, this.display.month);
        const newDate = helper.addMonth(oldDate, -1);
        const [year, month] = helper.getYearMonthDate(newDate);
        this.display = {year, month}
      }
      ,onClickNextMonth(){
        const oldDate = new Date(this.display.year, this.display.month);
        const newDate = helper.addMonth(oldDate, 1);
        const [year, month] = helper.getYearMonthDate(newDate);
        this.display = {year, month}
      }
      ,onClickNextYear(){
        const oldDate = new Date(this.display.year, this.display.month);
        const newDate = helper.addYear(oldDate, 1);
        const [year, month] = helper.getYearMonthDate(newDate);
        this.display = {year, month}
      }
      ,onClickYear(e){
        this.showYearInput = true;
        this.$nextTick(()=>{
          this.$refs.year.$refs.input.focus();
        })
      }
      ,onClickMonth(){
        this.showMonthInput = true;
        this.$nextTick(()=>{
          this.$refs.month.$refs.input.focus();
        })
      }
      ,onInputYear(value,e){
        if(/^\d{1,4}$/.test(value)){
          this.display.year = parseInt(value);
        }
      }
      ,onInputMonth(value,e){
        if(/^\d{1,2}$/.test(value)){
          this.display.month = parseInt(value)-1;
        }
      }



      //actions
      ,onClickToday(){
        const now = new Date();
        const [year, month, day] = helper.getYearMonthDate(now);
        this.display = {year, month};
        this.$emit('input', new Date(year, month, day));
        this[FORM_EVENTBUS] && this[FORM_EVENTBUS].$emit(`update:formItem`, this.field, 'change');
      }
      ,onClickClear(){
        this.$emit('input', null);
        this[FORM_EVENTBUS] && this[FORM_EVENTBUS].$emit(`update:formItem`, this.field, 'change');
        this.$refs.popover.close();
      }

    }

  }
</script>

<style lang="scss">
@import '../var';
.#{$ui-prefix}datePicker{
    display:inline-block;
    vertical-align: middle;
    display:inline-flex;
    align-items: center;

    &-popover{
        width:100%;
        &-contentWrapper{
            padding: 0;
            &-content{
                font-size:12px;
                color:$color;
                &-nav{
                    display:flex;

                    &-prevYear,&-prevMonth,&-nextMonth,&-nextYear{
                        fill:$color-light;
                        box-sizing:border-box;
                        width:24px;
                        height:24px;
                        margin:2px;
                        display:inline-flex;
                        justify-content: center;
                        align-items: center;
                        cursor: pointer;
                        transition:all .3s;
                        &:hover{
                            fill: $color;
                            font-weight: bolder;
                        }
                    }

                    &-yearAndMonth{
                        margin:auto;
                        >*{vertical-align: middle;}
                        &-year,&-month{
                            display:inline-flex;
                            align-items: center;
                            >span {
                                &:hover {
                                    color: #40a9ff;
                                    cursor: pointer;
                                }
                            }
                            input{
                                text-align: center;
                                padding:0;
                                line-height: inherit;
                                width:1.5em;
                            }
                        }
                        &-year{
                            margin-right:4px;
                            input{width:2.5em;}
                        }
                    }
                }

                &-panel{
                    &-row-cell,&-weekdays-weekday{
                        box-sizing:border-box;
                        width:24px;
                        height:24px;
                        margin:2px;
                        display:inline-flex;
                        justify-content: center;
                        align-items: center;
                    }

                    &-row-cell{
                        border-radius:3px;
                        &:not(.currentMonth){
                            color:$color-disabled;
                            cursor:not-allowed;
                        }
                        &.currentMonth{
                            &:hover{
                                background:#e1f0fe;
                                cursor:pointer;
                            }
                        }
                        &.today{
                            font-weight: bolder;
                            color:$red;
                        }
                        &.selected {
                            background: $blue;
                            color:#fff;
                        }
                    }
                }

                &-actions{
                    padding:4px;
                    text-align: center;
                    border-top:1px solid $borderColor-light;
                }
            }
        }
    }
}
</style>

<template>
    <div class="example">
        <h2>Slide Example</h2>
        <div style="height:1em;background: #4a90e2;"></div>

        <hr>
        <div>
            <p></p>
            <div>
                <Slide :selected.sync="selectedFrame1" auto-play class="slides-wrapper" dots="none" arrow="none">
                    <slide-item name="a">
                        <img src="../b.jpg" alt="">
                    </slide-item>
                    <slide-item name="b">
                        <img src="../b.jpg" alt="">
                    </slide-item>
                    <slide-item name="c">
                        <img src="../b.jpg" alt="">
                    </slide-item>
                </Slide>
            </div>
        </div>

        <hr>
        <div>
            <p></p>
            <div>
                <Slide :selected.sync="selectedFrame2" auto-play class="slides-wrapper" >
                    <slide-item name="a">
                        <img src="../b.jpg" alt="">
                    </slide-item>
                    <slide-item name="b">
                        <img src="../b.jpg" alt="">
                    </slide-item>
                    <slide-item name="c">
                        <img src="../b.jpg" alt="">
                    </slide-item>
                </Slide>
            </div>
        </div>

        <hr>
        <div>
            <p></p>
            <div>
                <Slide :selected.sync="selectedFrame3" self-adaption :auto-play="false" class="slides-wrapper">
                    <slide-item name="a">
                        <img src="../b.jpg" alt="">
                    </slide-item>
                    <slide-item name="b">
                        <img src="../b.jpg" alt="">
                    </slide-item>
                    <slide-item name="c">
                        <img src="../b.jpg" alt="">
                    </slide-item>
                </Slide>
            </div>
        </div>
    </div>
</template>

<script>
  import Slide from './index';
  import SlideItem from './SlideItem';
  export default {
    name: "Example"
    ,components:{Slide,SlideItem}
    ,data(){
      return{
        selectedFrame1:"c"
        ,selectedFrame2:"c"
        ,selectedFrame3:"c"
      }
    }
  }
</script>

<style lang="scss">
    .slides-wrapper:nth-of-type(1){
        width:200px;
    }
</style>

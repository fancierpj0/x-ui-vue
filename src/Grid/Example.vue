<template>
    <div class="example">
        <h2>Grid Example</h2>

        <div style="height:1em;background: #4a90e2;"></div>

        <hr>
        <div style="width:500px;">
            <p>父容器定宽响应式</p>
            <Row gutter="20">
                <Col span="12" :pad="{span:6}">
                    <div>1</div>
                </Col>
                <Col span="12" :pad="{span:6}">
                    <div>2</div>
                </Col>
                <Col span="12" :pad="{span:6}">
                    <div>3</div>
                </Col>
                <Col span="12" :pad="{span:6}">
                    <div>4</div>
                </Col>
            </Row>
        </div>

        <hr>
        <div >
            <p>父容器不定宽响应式</p>
            <Row gutter="40">
                <Col span="24" :pad="{span:12}" :narrow-pc="{span:6}">
                    <div>1</div>
                </Col>
                <Col span="24" :pad="{span:12}" :narrow-pc="{span:6}">
                    <div>2</div>
                </Col>
                <Col span="24" :pad="{span:12}" :narrow-pc="{span:6}">
                    <div>3</div>
                </Col>
                <Col span="24" :pad="{span:12}" :narrow-pc="{span:6}">
                    <div>4</div>
                </Col>
            </Row>
        </div>


        <hr>
        <div >
            <p>没有gutter</p>
            <Row>
                <Col span="6">
                    <div>1</div>
                </Col>
                <Col span="6">
                    <div>2</div>
                </Col>
                <Col span="6">
                    <div>3</div>
                </Col>
                <Col span="6">
                    <div>4</div>
                </Col>
            </Row>
        </div>


        <hr>
        <div >
            <p>offset，支持响应式</p>
            <Row gutter="20">
                <Col span="6" offset="6" :pad="{offset:0}" :pc="{offset:12}">
                    <div>2</div>
                </Col>

            </Row>
        </div>

        <hr>
        <div >
            <p>align，支持left、right、center</p>
            <Row gutter="20" align="center">
                <Col span="6">
                    <div>2</div>
                </Col>
                <Col span="6">
                    <div>3</div>
                </Col>
                <Col span="6">
                    <div>4</div>
                </Col>
            </Row>
        </div>
    </div>
</template>

<script>
  import Row from './Row';
  import Col from './Col';
  export default {
    name: "Example"
    ,components:{Row,Col}
  }
</script>

<style lang="scss">
@import "../var";
.#{$ui-prefix}col{
    >div{background:lightblue;}
}
</style>

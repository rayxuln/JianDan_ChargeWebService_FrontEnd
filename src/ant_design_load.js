import Vue from 'vue';

import { Button } from 'ant-design-vue';
import { Col, Row } from 'ant-design-vue';
import { Layout } from 'ant-design-vue';
import { Input } from 'ant-design-vue';
import { Icon } from 'ant-design-vue';
import { Tooltip } from 'ant-design-vue';
import { Menu } from 'ant-design-vue';
import { Alert } from 'ant-design-vue';
import { Empty } from 'ant-design-vue';
import { Skeleton } from 'ant-design-vue';
import { Descriptions } from 'ant-design-vue';

Vue.component(Button.name, Button)

Vue.component(Col.name, Col)
Vue.component(Row.name, Row)

Vue.component(Layout.name, Layout)
Vue.component(Layout.Header.name, Layout.Header)
Vue.component(Layout.Content.name, Layout.Content)
Vue.component(Layout.Footer.name, Layout.Footer)
Vue.component(Layout.Sider.name, Layout.Sider)

Vue.component(Menu.name, Menu)
Vue.component(Menu.Item.name, Menu.Item)

Vue.component(Input.name, Input)
Vue.component(Input.Password.name, Input.Password)

Vue.component(Icon.name, Icon)

Vue.component(Tooltip.name, Tooltip)

Vue.component(Alert.name, Alert)

Vue.component(Empty.name, Empty)

Vue.component(Skeleton.name, Skeleton)

Vue.component(Descriptions.name, Descriptions)
Vue.component(Descriptions.Item.name, Descriptions.Item)
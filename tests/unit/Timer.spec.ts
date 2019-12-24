import "../localStorage.js";
import Vuex from "vuex";

import { expect } from "chai";
import { shallowMount, createLocalVue } from "@vue/test-utils";
import Timer from "@/components/Timer.vue";
import store from "@/store";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("Timer.vue", function() {
  it("renders", () => {
    const wrapper = shallowMount(Timer, { store, localVue });
    expect(wrapper.exists()).to.be.true;
  });
});

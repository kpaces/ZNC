import { expect } from "chai";
import { shallowMount } from "@vue/test-utils";
import Cover from "@/components/Cover.vue";

describe("Cover.vue", function() {
  it("renders", () => {
    const wrapper = shallowMount(Cover);
    expect(wrapper.exists()).to.be.true;
  });
});


import Vue, { VNode } from "vue";
import { PlayerInputFactory } from "./PlayerInputFactory";

let unique: number = 0;

export const OrOptions = Vue.component("or-options", {
    props: ["player", "players", "playerinput", "onsave", "showsave", "showtitle"],
    data: function () {
        return {
            childComponents: [],
            selectedOption: 0
        };
    },
    methods: {
        saveData: function () {
            const componentInstance = this.$data.childComponents[this.$data.selectedOption].componentInstance;
            if (componentInstance !== undefined) {
                if ((componentInstance as any).saveData instanceof Function) {
                    (componentInstance as any).saveData();
                    return;
                }
            }
            throw new Error("Unexpected unable to save data");
        }
    },
    render: function (createElement) {
        unique++;
        this.$data.childComponents = [];
        const children: Array<VNode> = [];
        if (this.showtitle) {
            children.push(createElement('label', [createElement("div", this.playerinput.title)]))
        }
        const optionElements: Array<VNode> = [];
        this.playerinput.options.forEach((option: any, idx: number) => {
            const domProps: {[key: string]: any} = {
                //className: "nes-radio",
                name: "selectOption" + unique,
                type: "radio",
                value: String(idx)
            };
            const displayStyle: string = this.$data.selectedOption === idx ? "block" : "none";
            const subchildren: Array<VNode> = [];
            if (this.$data.selectedOption === idx) {
                domProps.checked = true;
            }
            //STYLE CHANGE
            subchildren.push(createElement("label", [
                //createElement("input", { style: { display: displayStyle }, domProps, on: { change: (event: any) => {
                    createElement("input", { domProps, on: { change: (event: any) => {
                    this.selectedOption = Number(event.target.value);
                }}}),
                createElement("span", option.title)
            ]));
            this.$data.childComponents.push(new PlayerInputFactory().getPlayerInput(createElement, this.players, this.player, option, (out: Array<Array<string>>) => {
                const copy = out[0].slice();
                copy.unshift(String(idx));
                this.onsave([copy]);
            }, false, false));
            subchildren.push(createElement("div", { style: { display: displayStyle, marginLeft: "30px" } }, [this.$data.childComponents[this.$data.childComponents.length - 1]]));
            //subchildren.push(createElement("div", { style: { marginLeft: "30px" } }, [this.$data.childComponents[this.$data.childComponents.length - 1]]));
            optionElements.push(subchildren[subchildren.length - 1]);
            children.push(createElement("div", subchildren));
        });
        if (this.showsave) {
            children.push(createElement("div", {"class": "wf-action"}, [createElement("button", { domProps: { className: "btn btn-primary" }, on: { click: () => { this.saveData(); } } }, "Save")]));
        }
        return createElement("div", {"class": "wf-options"}, children);
    }
});



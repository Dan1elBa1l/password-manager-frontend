import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import DynamicFormCC from '@/components/DynamicFormCC.vue'; // Pfad anpassen

describe('DynamicFormCC', () => {
    it('sollte die Komponente korrekt erstellen', () => {
        const wrapper = mount(DynamicFormCC);
        expect(wrapper.exists()).toBeTruthy();
        expect(wrapper.vm.creditCardData).toBeDefined();
        expect(wrapper.vm.creditCards).toEqual([]);
    });

    it('sollte CVV-Validierung korrekt funktionieren', async () => {
        const wrapper = mount(DynamicFormCC);
        await wrapper.setData({ creditCardData: { cvv: '123' } });
        expect(wrapper.vm.isValidCVV).toBe(true);
        await wrapper.setData({ creditCardData: { cvv: '12' } });
        expect(wrapper.vm.isValidCVV).toBe(false);
    });

    it('sollte die Anzeige der Kreditkarten umschalten', async () => {
        const wrapper = mount(DynamicFormCC);
        expect(wrapper.vm.showCreditCards).toBe(false);
        await wrapper.vm.toggleShowCreditCards();
        expect(wrapper.vm.showCreditCards).toBe(true);
    });
});

import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import DynamicFormPW from '@/components/DynamicFormPW.vue'; // Korrigieren Sie den Pfad entsprechend

// Mock für `fetch`
vi.stubGlobal('fetch', vi.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve([]) // Leeres Array als Mock-Antwort
    })
));

describe('DynamicFormPW', () => {
    it('sollte die Komponente korrekt erstellen', () => {
        const wrapper = mount(DynamicFormPW);
        expect(wrapper.exists()).toBeTruthy();
    });

    it('sollte `showPasswords` umschalten, wenn `toggleShowPasswords` aufgerufen wird', async () => {
        const wrapper = mount(DynamicFormPW);
        expect(wrapper.vm.showPasswords).toBe(false);
        await wrapper.vm.toggleShowPasswords();
        expect(wrapper.vm.showPasswords).toBe(true);
    });

    it('sollte Passwörter anzeigen, wenn `showPasswords` wahr ist', () => {
        const wrapper = mount(DynamicFormPW, {
            data() {
                return {
                    showPasswords: true,
                    passwords: [] // Fügen Sie hier mögliche Mock-Daten hinzu
                };
            }
        });
        expect(wrapper.find('.table').exists()).toBeTruthy();
    });
});

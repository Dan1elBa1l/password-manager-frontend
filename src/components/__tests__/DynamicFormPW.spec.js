import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import YourComponent from '@/components/DynamicFormPW.vue'; // Pfad zu Ihrer Komponentendatei anpassen

describe('PasswordManager', () => {
    it('sollte die Komponente korrekt erstellen', () => {
        const wrapper = mount(YourComponent);
        expect(wrapper.exists()).toBeTruthy();
    });

    it('sollte `showPasswords` umschalten, wenn `toggleShowPasswords` aufgerufen wird', async () => {
        const wrapper = mount(YourComponent);
        expect(wrapper.vm.showPasswords).toBe(false);
        await wrapper.vm.toggleShowPasswords();
        expect(wrapper.vm.showPasswords).toBe(true);
    });

    it('sollte Passwörter anzeigen, wenn `showPasswords` wahr ist', () => {
        const wrapper = mount(YourComponent, {
            data() {
                return {
                    showPasswords: true
                };
            }
        });
        expect(wrapper.find('.table').exists()).toBeTruthy();
    });
});

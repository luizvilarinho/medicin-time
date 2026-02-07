
import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Platform } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    constructor(private platform: Platform) { }

    async solicitarPermissao() {
        if (this.platform.is('capacitor')) {
            const status = await LocalNotifications.requestPermissions();
            return status.display === 'granted';
        }
        return true; // Web browser usually asks via Notification API, but for dev purposes consider true if not capacitor
    }

    async agendarNotificacao(id: number, titulo: string, corpo: string, agendamento: Date) {
        if (this.platform.is('capacitor')) {
            await LocalNotifications.schedule({
                notifications: [
                    {
                        title: titulo,
                        body: corpo,
                        id: id,
                        schedule: { at: agendamento },
                        sound: 'beep.wav', // Default sound
                        attachments: undefined,
                        actionTypeId: '',
                        extra: null
                    }
                ]
            });
        } else {
            console.log('Notificação Agendada (Simulação Web):', { id, titulo, corpo, agendamento });
        }
    }

    async cancelarNotificacao(id: number) {
        if (this.platform.is('capacitor')) {
            await LocalNotifications.cancel({ notifications: [{ id }] });
        }
    }
}

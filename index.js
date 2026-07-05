const express = require("express");
const { 
    Client, 
    GatewayIntentBits, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle, 
    EmbedBuilder, 
    StringSelectMenuBuilder, 
    ModalBuilder, 
    TextInputBuilder, 
    TextInputStyle, 
    ChannelType, 
    PermissionFlagsBits 
} = require('discord.js');

// 🌐 Configuración del Servidor Express para Render
const app = express();

app.get("/", (req, res) => {
    res.send("🎫 ULTIME TICKET está en línea.");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🌐 Servidor web iniciado en el puerto ${PORT}`);
});

// 🤖 Configuración del Cliente de Discord
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// ⚙️ Configuración Única y Preconfigurada
const CONFIG = {
    TOKEN: 'TOKEN: process.env.TOKEN, // Coloca aquí el Token de tu bot de Discord
    STAFF_ROLE: '1523178739653939240',
    CATEGORY_TICKETS: '1523175945253421067',
    LOGS_CHANNEL: '1523175945253421069'
};

client.once('ready', () => {
    console.log(`🎫 ULTIME TICKET está en línea como ${client.user.tag}`);
});

// 📜 Registro Automático del Comando /send-panel-ticket
client.on('ready', async () => {
    await client.application?.commands.create({
        name: 'send-panel-ticket',
        description: 'Envía el panel oficial de ULTIME TICKET al canal.',
        defaultMemberPermissions: PermissionFlagsBits.Administrator
    });
});

// 📜 Ejecución del Comando
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'send-panel-ticket') {
        const embedPanel = new EmbedBuilder()
            .setTitle('🎫 ULTIME TICKET • Centro de Soporte')
            .setDescription(
                'Bienvenido al sistema de soporte oficial de **ULTIME TICKET**.\n' +
                '¿Necesitas ayuda? Nuestro sistema de tickets te permite contactar con el equipo de soporte de forma rápida, privada y organizada.\n\n' +
                '✨ **¿Cómo funciona?**\n' +
                '📂 Selecciona una categoría.\n' +
                '📝 Completa el formulario.\n' +
                '🎫 El bot creará automáticamente un ticket privado.\n' +
                '💬 Espera la respuesta del Staff.\n\n' +
                '📋 **Categorías**\n' +
                '🛠️ Soporte Técnico\n' +
                '🐞 Reportar Bugs\n' +
                '⚙️ Configuración\n' +
                '💡 Sugerencias\n' +
                '❓ Otras Consultas\n\n' +
                '📌 **Reglas**\n' +
                '• No abras tickets duplicados.\n' +
                '• Explica bien tu problema.\n' +
                '• Adjunta capturas si es necesario.\n' +
                '• Respeta al Staff.\n\n' +
                '⬇️ **Selecciona una categoría para comenzar.**'
            )
            .setColor('#2b2d31')
            .setFooter({ text: 'Powered by ULTIME TICKET', iconURL: interaction.guild.iconURL() });

        const menuCategorias = new StringSelectMenuBuilder()
            .setCustomId('select_ultime_categoria')
            .setPlaceholder('📁 Elige una categoría para abrir un ticket...')
            .addOptions([
                { label: 'Soporte Técnico', value: 'soporte_tecnico', emoji: '🛠️' },
                { label: 'Reportar Bugs', value: 'reportar_bugs', emoji: '🐞' },
                { label: 'Configuración', value: 'configuracion', emoji: '⚙️' },
                { label: 'Sugerencias', value: 'sugerencias', emoji: '💡' },
                { label: 'Otras Consultas', value: 'otras_consultas', emoji: '❓' }
            ]);

        const row = new ActionRowBuilder().addComponents(menuCategorias);

        await interaction.reply({ content: '✅ Panel de tickets enviado correctamente.', ephemeral: true });
        await interaction.channel.send({ embeds: [embedPanel], components: [row] });
    }
});

// 📁 Manejo de Interacciones (Menús, Modales y Botones)
client.on('interactionCreate', async interaction => {

    // 📝 PASO 1: Selección en el menú -> Desplegar Modal Personalizado
    if (interaction.isStringSelectMenu() && interaction.customId === 'select_ultime_categoria') {
        const seleccion = interaction.values[0];
        
        const nombresCategorias = {
            soporte_tecnico: 'Soporte Técnico',
            reportar_bugs: 'Reportar Bugs',
            configuracion: 'Configuración',
            sugerencias: 'Sugerencias',
            otras_consultas: 'Otras Consultas'
        };

        const modal = new ModalBuilder()
            .setCustomId(`modal_ultime_${seleccion}`)
            .setTitle(`Formulario: ${nombresCategorias[seleccion]}`);

        if (seleccion === 'soporte_tecnico') {
            modal.addComponents(
                new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('campo_1').setLabel('Nombre de usuario / ID').setPlaceholder('Ej: Keyner#0001').setStyle(TextInputStyle.Short).setRequired(true)),
                new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('campo_2').setLabel('Describe detalladamente tu problema').setStyle(TextInputStyle.Paragraph).setRequired(true)),
                new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('campo_3').setLabel('Versión del servicio / Detalles extra').setPlaceholder('Opcional').setStyle(TextInputStyle.Short).setRequired(false))
            );
        } else if (seleccion === 'reportar_bugs') {
            modal.addComponents(
                new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('campo_1').setLabel('¿Dónde ocurre el error?').setPlaceholder('Ej: En los comandos, en los roles...').setStyle(TextInputStyle.Short).setRequired(true)),
                new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('campo_2').setLabel('Pasos para replicar el bug o fallo').setStyle(TextInputStyle.Paragraph).setRequired(true))
            );
        } else if (seleccion === 'sugerencias') {
            modal.addComponents(
                new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('campo_1').setLabel('Título de la sugerencia').setStyle(TextInputStyle.Short).setRequired(true)),
                new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('campo_2').setLabel('Explica tu idea y cómo mejoraría el servicio').setStyle(TextInputStyle.Paragraph).setRequired(true))
            );
        } else {
            modal.addComponents(
                new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('campo_1').setLabel('Asunto principal').setStyle(TextInputStyle.Short).setRequired(true)),
                new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('campo_2').setLabel('Explica detalladamente tu consulta').setStyle(TextInputStyle.Paragraph).setRequired(true))
            );
        }

        await interaction.showModal(modal);
    }

    // 🎫 PASO 2: Envío de Formulario (Creación del canal del Ticket)
    if (interaction.isModalSubmit() && interaction.customId.startsWith('modal_ultime_')) {
        await interaction.deferReply({ ephemeral: true });

        const categoriaKey = interaction.customId.replace('modal_ultime_', '');
        const randomID = Math.floor(1000 + Math.random() * 9000);

        const mapaCategorias = {
            soporte_tecnico: '🛠️ Soporte Técnico',
            reportar_bugs: '🐞 Reportar Bugs',
            configuracion: '⚙️ Configuración',
            sugerencias: '💡 Sugerencias',
            otras_consultas: '❓ Otras Consultas'
        };
        const nombreCategoriaFormateado = mapaCategorias[categoriaKey] || 'General';

        let formularioRespondido = '';
        try {
            const c1 = interaction.fields.getTextInputValue('campo_1');
            const label1 = interaction.components[0].components[0].data.label;
            formularioRespondido += `**${label1}:** ${c1}\n`;

            const c2 = interaction.fields.getTextInputValue('campo_2');
            const label2 = interaction.components[1].components[0].data.label;
            formularioRespondido += `**${label2}:** ${c2}\n`;

            const c3 = interaction.fields.getTextInputValue('campo_3');
            if (c3) {
                const label3 = interaction.components[2].components[0].data.label;
                formularioRespondido += `**${label3}:** ${c3}\n`;
            }
        } catch (e) { }

        const canalTicket = await interaction.guild.channels.create({
            name: `ticket-${interaction.user.username}`,
            type: ChannelType.GuildText,
            parent: CONFIG.CATEGORY_TICKETS,
            permissionOverwrites: [
                { id: interaction.guild.id, deny: [PermissionFlagsBits.ViewChannel] },
                { id: interaction.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] },
                { id: CONFIG.STAFF_ROLE, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] }
            ]
        });

        const embedTicket = new EmbedBuilder()
            .setTitle('🎫 Ticket Creado')
            .setDescription(`👋 Bienvenido al canal de tu solicitud, ${interaction.user}. El Staff te atenderá lo antes posible.\n\n**📝 Respuestas del Formulario:**\n${formularioRespondido}`)
            .setColor('#2b2d31')
            .addFields(
                { name: '👤 Usuario', value: `${interaction.user.tag} (${interaction.user.id})`, inline: true },
                { name: '📂 Categoría', value: nombreCategoriaFormateado, inline: true },
                { name: '🆔 ID del Ticket', value: `#${randomID}`, inline: true },
                { name: '📅 Fecha', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: false },
                { name: '👤 Reclamado por:', value: 'Nadie', inline: true },
                { name: '📌 Estado:', value: '🟢 Abierto', inline: true }
            )
            .setFooter({ text: 'ULTIME TICKET • Gestión Interna' });

        const botonesRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId(`ultime_reclamar_${interaction.user.id}`).setLabel('Reclamar').setEmoji('👤').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId(`ultime_cerrar_${interaction.user.id}_${randomID}_${categoriaKey}`).setLabel('Cerrar').setEmoji('🔒').setStyle(ButtonStyle.Danger)
        );

        await canalTicket.send({ content: `${interaction.user} | <@&${CONFIG.STAFF_ROLE}>`, embeds: [embedTicket], components: [botonesRow] });
        await interaction.editReply({ content: `✅ Tu ticket ha sido abierto correctamente en: ${canalTicket}` });

        const canalLogs = interaction.guild.channels.cache.get(CONFIG.LOGS_CHANNEL);
        if (canalLogs) {
            const embedLogCreacion = new EmbedBuilder()
                .setTitle('📥 Logs • Ticket Creado')
                .setColor('#57f287')
                .setDescription(`Se ha abierto un nuevo ticket en el servidor.`)
                .addFields(
                    { name: '👤 Usuario Creador', value: `${interaction.user.tag} (${interaction.user.id})`, inline: true },
                    { name: '📂 Categoría', value: nombreCategoriaFormateado, inline: true },
                    { name: '🆔 ID del Ticket', value: `#${randomID}`, inline: true },
                    { name: '🌐 Canal', value: `${canalTicket.name}`, inline: false }
                )
                .setTimestamp();
            await canalLogs.send({ embeds: [embedLogCreacion] });
        }
    }

    // 👤 ACCIÓN: RECLAMAR TICKET (🛡️ Protegido)
    if (interaction.isButton() && interaction.customId.startsWith('ultime_reclamar_')) {
        if (!interaction.member.roles.cache.has(CONFIG.STAFF_ROLE)) {
            return interaction.reply({ content: '❌ No tienes permisos para reclamar este ticket.', ephemeral: true });
        }

        const embedOriginal = EmbedBuilder.from(interaction.message.embeds[0]);
        embedOriginal.spliceFields(4, 1, { name: '👤 Reclamado por:', value: `${interaction.user}`, inline: true });

        const rowModificada = ActionRowBuilder.from(interaction.message.components[0]);
        rowModificada.components[0].setDisabled(true).setLabel('Reclamado');

        await interaction.update({ embeds: [embedOriginal], components: [rowModificada] });
        await interaction.channel.send({ content: `👤 Este ticket ahora está siendo atendido por ${interaction.user}.` });

        const canalLogs = interaction.guild.channels.cache.get(CONFIG.LOGS_CHANNEL);
        if (canalLogs) {
            const embedLogReclamar = new EmbedBuilder()
                .setTitle('🤝 Logs • Ticket Reclamado')
                .setColor('#5865f2')
                .setDescription(`Un miembro del Staff ha tomado un ticket de forma activa.`)
                .addFields(
                    { name: '👮 Staff', value: `${interaction.user.tag} (${interaction.user.id})`, inline: true },
                    { name: '🌐 Canal afectado', value: `${interaction.channel.name}`, inline: true }
                )
                .setTimestamp();
            await canalLogs.send({ embeds: [embedLogReclamar] });
        }
    }

    // 🔒 ACCIÓN: CERRAR TICKET + TRANSCRIPCIÓN AUTOMÁTICA (🛡️ Protegido)
    if (interaction.isButton() && interaction.customId.startsWith('ultime_cerrar_')) {
        if (!interaction.member.roles.cache.has(CONFIG.STAFF_ROLE)) {
            return interaction.reply({ content: '❌ No tienes permisos para cerrar este ticket.', ephemeral: true });
        }

        const [, , creadorId, ticketID, catKey] = interaction.customId.split('_');

        await interaction.reply({ content: '🔒 Procesando cierre y generando transcripción...' });

        const mensajesFetcheados = await interaction.channel.messages.fetch({ limit: 100 });
        let cuerpoTranscripcion = `==================================================\n`;
        cuerpoTranscripcion += `📝 TRANSCRIPCIÓN OFICIAL - ULTIME TICKET\n`;
        cuerpoTranscripcion += `🆔 ID del Ticket: #${ticketID} | Categoría: ${catKey.toUpperCase()}\n`;
        cuerpoTranscripcion += `🌐 Canal: ${interaction.channel.name}\n`;
        cuerpoTranscripcion += `🔒 Cerrado por: ${interaction.user.tag} (${interaction.user.id})\n`;
        cuerpoTranscripcion += `==================================================\n\n`;

        mensajesFetcheados.reverse().forEach(msg => {
            cuerpoTranscripcion += `[${msg.createdAt.toLocaleString()}] ${msg.author.tag} (${msg.author.id}): ${msg.content}\n`;
            if (msg.embeds.length > 0) cuerpoTranscripcion += `   > [Embed Mensaje Presente]\n`;
        });

        const archivoAdjunto = Buffer.from(cuerpoTranscripcion, 'utf-8');

        const canalLogs = interaction.guild.channels.cache.get(CONFIG.LOGS_CHANNEL);
        if (canalLogs) {
            const embedLogCierre = new EmbedBuilder()
                .setTitle('🔒 Logs • Ticket Cerrado')
                .setColor('#ed4245')
                .setDescription(`El canal del ticket ha sido clausurado y eliminado de inmediato.`)
                .addFields(
                    { name: '🆔 ID Ticket', value: `#${ticketID}`, inline: true },
                    { name: '👮 Cerrado Por', value: `${interaction.user.tag} (${interaction.user.id})`, inline: true }
                )
                .setTimestamp();

            await canalLogs.send({ 
                embeds: [embedLogCierre], 
                files: [{ attachment: archivoAdjunto, name: `transcript-ticket-${ticketID}.txt` }] 
            });
        }

        setTimeout(async () => {
            await interaction.channel.delete().catch(() => {});
        }, 3000);
    }
});

client.login(CONFIG.TOKEN);

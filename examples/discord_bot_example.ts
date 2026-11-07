import {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ChatInputCommandInteraction,
  ButtonInteraction,
  ModalSubmitInteraction,
} from 'discord.js';
import { AlightMotionAPI } from './client';

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN || 'TOKEN_BOT';
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID || 'CLIENT_ID';
const API_URL = process.env.ALIGHT_API_URL || 'api_url';
const API_KEY = process.env.ALIGHT_API_KEY || 'am_live_KEY';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const api = new AlightMotionAPI(API_URL, API_KEY);
const sessions = new Map<string, { email: string; plan: string }>();

const commands = [
  new SlashCommandBuilder().setName('kuota').setDescription('Cek sisa kuota API Alight Motion'),
  new SlashCommandBuilder().setName('paket').setDescription('Daftar paket durasi yang aktif'),
  new SlashCommandBuilder()
    .setName('upgrade')
    .setDescription('Upgrade akun Alight Motion ke Pro')
    .addStringOption((opt) => opt.setName('email').setDescription('Email target').setRequired(true))
    .addStringOption((opt) =>
      opt
        .setName('plan')
        .setDescription('Pilihan paket')
        .addChoices(
          { name: '1 Oktober 2026 (2 Bulan)', value: '2_bulan' },
          { name: '2 Februari 2027 (6 Bulan)', value: '6_bulan' },
          { name: '2 Juli 2027 (11 Bulan)', value: '11_bulan' },
          { name: '2 Agustus 2027 (12 Bulan)', value: '12_bulan' }
        )
    ),
].map((c) => c.toJSON());

client.once('ready', async () => {
  console.log(`Bot online: ${client.user?.tag}`);
  const rest = new REST({ version: '10' }).setToken(DISCORD_BOT_TOKEN);
  await rest.put(Routes.applicationCommands(DISCORD_CLIENT_ID), { body: commands });
});

client.on('interactionCreate', async (i) => {
  if (i.isChatInputCommand()) return handleCommand(i);
  if (i.isButton()) return handleButton(i);
  if (i.isModalSubmit()) return handleModal(i);
});

async function handleCommand(i: ChatInputCommandInteraction) {
  if (i.commandName === 'kuota') {
    await i.deferReply({ ephemeral: true });
    const res = await api.getQuota();
    if (!res.success || !res.data) return i.editReply(`Error: ${res.error}`);

    const embed = new EmbedBuilder()
      .setColor(0xf59f0b)
      .setTitle('Status Kuota API')
      .addFields(
        { name: 'User', value: `\`${res.data.name}\``, inline: true },
        { name: 'Sisa Kuota', value: `\`${res.data.remaining_quota}\``, inline: true },
        { name: 'Total Upgrade', value: `\`${res.data.total_created}\``, inline: true },
        { name: 'Masa Aktif', value: `\`${res.data.expires_at || 'Lifetime'}\`` }
      );

    return i.editReply({ embeds: [embed] });
  }

  if (i.commandName === 'paket') {
    await i.deferReply({ ephemeral: true });
    const res = await api.getPlans();
    if (!res.success || !res.data) return i.editReply('Gagal memuat daftar paket.');

    const embed = new EmbedBuilder()
      .setColor(0x3b82f6)
      .setTitle('Pilihan Durasi Paket')
      .setDescription(res.data.map((p) => `• **${p.id}** — aktif s/d ${p.label}`).join('\n'));

    return i.editReply({ embeds: [embed] });
  }

  if (i.commandName === 'upgrade') {
    const email = i.options.getString('email', true).trim();
    const plan = i.options.getString('plan') || '2_bulan';

    if (!email.includes('@')) return i.reply({ content: 'Format email salah.', ephemeral: true });

    await i.deferReply({ ephemeral: true });
    const send = await api.sendVerificationLink(email);
    if (!send.success) return i.editReply(`Gagal kirim link: ${send.error}`);

    sessions.set(i.user.id, { email, plan });

    const embed = new EmbedBuilder()
      .setColor(0x10b981)
      .setTitle('Link Verifikasi Terkirim')
      .setDescription(
        `Link sudah dikirim ke **${email}**.\n\n` +
          '1. Cek inbox atau spam email kamu.\n' +
          '2. Copy link verifikasinya (jangan dibuka di browser).\n' +
          '3. Klik tombol di bawah buat paste link-nya.'
      );

    const btn = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder().setCustomId('btn_link').setLabel('Input Link Verifikasi').setStyle(ButtonStyle.Success)
    );

    return i.editReply({ embeds: [embed], components: [btn] });
  }
}

async function handleButton(i: ButtonInteraction) {
  if (i.customId === 'btn_link') {
    if (!sessions.has(i.user.id)) {
      return i.reply({ content: 'Sesi habis. Jalankan /upgrade lagi.', ephemeral: true });
    }

    const modal = new ModalBuilder().setCustomId('modal_link').setTitle('Verifikasi Alight Motion');
    const input = new TextInputBuilder()
      .setCustomId('link_input')
      .setLabel('Paste link dari email:')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    modal.addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(input));
    await i.showModal(modal);
  }
}

async function handleModal(i: ModalSubmitInteraction) {
  if (i.customId === 'modal_link') {
    const session = sessions.get(i.user.id);
    if (!session) return i.reply({ content: 'Sesi habis. Ulangi dengan /upgrade.', ephemeral: true });

    await i.deferReply({ ephemeral: true });
    const link = i.fields.getTextInputValue('link_input').trim();
    const res = await api.upgradeToPro(session.email, link, session.plan);

    if (!res.success || !res.data) {
      return i.editReply(`Gagal upgrade: ${res.error || 'Link tidak valid atau sudah basi.'}`);
    }

    sessions.delete(i.user.id);
    const embed = new EmbedBuilder()
      .setColor(0xf59f0b)
      .setTitle('Akun Berhasil Jadi Pro')
      .addFields(
        { name: 'Email', value: `\`${res.data.email}\``, inline: true },
        { name: 'Paket', value: `\`${res.data.plan}\``, inline: true },
        { name: 'Aktif s/d', value: `\`${res.data.expires_estimated}\``, inline: false },
        { name: 'Sisa Kuota', value: `\`${res.data.remaining_quota}\``, inline: true }
      );

    return i.editReply({ embeds: [embed] });
  }
}

client.login(DISCORD_BOT_TOKEN);

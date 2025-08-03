'use strict';

const bcrypt = require("bcrypt");
const { v4 } = require("uuid");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const hashPassword = await bcrypt.hash("123", 10);
    const accounts = [
      {
        display_name: "Phí Văn Đức",
        name: "pvd",
        password: hashPassword,
        avatar: `https://picsum.photos/seed/pvd/200`
      },
      {
        display_name: "Nguyễn Long Dương",
        name: "nld",
        password: hashPassword,
        avatar: `https://picsum.photos/seed/nld/200`
      },
      {
        display_name: "Bùi Minh Đức",
        name: "bmd",
        password: hashPassword,
        avatar: `https://picsum.photos/seed/bmd/200`
      },
      {
        display_name: "Hoàng Thanh Tùng",
        name: "htt",
        password: hashPassword,
        avatar: `https://picsum.photos/seed/htt/200`
      },
      {
        display_name: "Trần Thị Mai",
        name: "ttm",
        password: hashPassword,
        avatar: `https://picsum.photos/seed/ttm/200`
      },
      {
        display_name: "Lê Văn Hòa",
        name: "lvh",
        password: hashPassword,
        avatar: `https://picsum.photos/seed/lvh/200`
      },
      {
        display_name: "Đỗ Minh Anh",
        name: "dma",
        password: hashPassword,
        avatar: `https://picsum.photos/seed/dma/200`
      },
      {
        display_name: "Ngô Thị Hương",
        name: "nth",
        password: hashPassword,
        avatar: `https://picsum.photos/seed/nth/200`
      },
      {
        display_name: "Vũ Anh Tuấn",
        name: "vat",
        password: hashPassword,
        avatar: `https://picsum.photos/seed/vat/200`
      },
      {
        display_name: "Phạm Thị Lan",
        name: "ptl",
        password: hashPassword,
        avatar: `https://picsum.photos/seed/ptl/200`
      },
      {
        display_name: "Trịnh Công Sơn",
        name: "tcs",
        password: hashPassword,
        avatar: `https://picsum.photos/seed/tcs/200`
      },
      {
        display_name: "Đinh Nhật Hào",
        name: "dnh",
        password: hashPassword,
        avatar: `https://picsum.photos/seed/dnh/200`
      },
      {
        display_name: "Tạ Ngọc Hưng",
        name: "tnh",
        password: hashPassword,
        avatar: `https://picsum.photos/seed/tnh/200`
      },
      {
        display_name: "Lý Thanh Thảo",
        name: "ltt",
        password: hashPassword,
        avatar: `https://picsum.photos/seed/ltt/200`
      },
      {
        display_name: "Mai Hương Giang",
        name: "mhg",
        password: hashPassword,
        avatar: `https://picsum.photos/seed/mhg/200`
      },
      {
        display_name: "Phan Văn Tùng",
        name: "pvt",
        password: hashPassword,
        avatar: `https://picsum.photos/seed/pvt/200`
      },
      {
        display_name: "Bạch Thị Thu",
        name: "btt",
        password: hashPassword,
        avatar: `https://picsum.photos/seed/btt/200`
      },
      {
        display_name: "Nguyễn Gia Huy",
        name: "ngh",
        password: hashPassword,
        avatar: `https://picsum.photos/seed/ngh/200`
      },
      {
        display_name: "Lâm Nhật Quang",
        name: "lnq",
        password: hashPassword,
        avatar: `https://picsum.photos/seed/lnq/200`
      },
      {
        display_name: "Trương Mỹ Linh",
        name: "tml",
        password: hashPassword,
        avatar: `https://picsum.photos/seed/tml/200`
      },
      {
        display_name: "Đoàn Văn Hải",
        name: "dvh",
        password: hashPassword,
        avatar: `https://picsum.photos/seed/dvh/200`
      },
      {
        display_name: "Hồ Minh Châu",
        name: "hmc",
        password: hashPassword,
        avatar: `https://picsum.photos/seed/hmc/200`
      },
      {
        display_name: "Lương Thế Vinh",
        name: "ltv",
        password: hashPassword,
        avatar: `https://picsum.photos/seed/ltv/200`
      },
      {
        display_name: "Tống Quang Vinh",
        name: "tqv",
        password: hashPassword,
        avatar: `https://picsum.photos/seed/tqv/200`
      }
    ];

    const finalAccounts = accounts.map(account => ({
      id: v4(),
      ...account,
      created_at: new Date(),
      updated_at: new Date()
    }))

    await queryInterface.bulkInsert('accounts', finalAccounts, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('accounts', null, {});
  }
};
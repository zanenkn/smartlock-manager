const { Seam } = require('seam');

const seam = new Seam();

async function createAccessCode({ name, starts_at, ends_at, code }) {
  try {
    const device = await seam.locks.get({
      device_id: '5a534c36-9fa0-4a5d-8d7c-cdc645b7b0f6',
    });

    if (device.can_program_online_access_codes) {
      const newCode = await seam.accessCodes.create({
        device_id: '5a534c36-9fa0-4a5d-8d7c-cdc645b7b0f6',
        name,
        starts_at,
        ends_at,
        code,
      });

      return newCode;
    } else {
      throw new Error('Device cannot program online access codes.');
    }
  } catch (error) {
    console.error('Error creating access code:', error.message);
    throw new Error(`Access code creation failed: ${error.message}`);
  }
}

module.exports = {
  createAccessCode,
};

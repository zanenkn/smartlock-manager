const { Seam } = require('seam');

const seam = new Seam();

async function createAccessCode({
  name,
  starts_at,
  ends_at,
  preferred_code_length,
}) {
  try {
    const newCode = await seam.accessCodes.create({
      device_id: '5a534c36-9fa0-4a5d-8d7c-cdc645b7b0f6',
      name,
      starts_at,
      ends_at,
      preferred_code_length,
    });

    return newCode;
  } catch (error) {
    console.error('Error creating access code:', error.message);
    throw new Error(`Access code creation failed: ${error.message}`);
  }
}

module.exports = {
  createAccessCode,
};

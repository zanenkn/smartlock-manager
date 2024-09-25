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
      device_id: process.env.SEAM_DEVICE_ID,
      name,
      starts_at,
      ends_at,
      preferred_code_length,
    });

    return newCode;
  } catch (error) {
    throw new Error(`Access code could not be created: ${error.message}`);
  }
}

async function getAccessCodeFromBookingId(bookingId) {
  try {
    const allCodes = await seam.accessCodes.list({
      device_id: process.env.SEAM_DEVICE_ID,
    });

    const accessCode = allCodes.find((accessCode) => {
      const match = accessCode.name.match(/Booking nr\.\s*(\d+)\s*for/);
      return match && match[1] === String(bookingId);
    });

    return accessCode;
  } catch (error) {
    throw new Error(
      `Access code for booking nr. ${bookingId} could not be found: ${error.message}`
    );
  }
}

async function updateAccessCode({ access_code_id, starts_at, ends_at }) {
  try {
    const updatedAccessCode = await seam.accessCodes.update({
      access_code_id,
      starts_at,
      ends_at,
    });

    return updatedAccessCode;
  } catch (error) {
    throw new Error(`Access code could not be updated: ${error.message}`);
  }
}

async function deleteAccessCode(id) {
  try {
    const deletedAccessCode = await seam.accessCodes.delete({
      access_code_id: id,
    });

    return deletedAccessCode;
  } catch (error) {
    throw new Error(`Access code could not be deleted: ${error.message}`);
  }
}

module.exports = {
  createAccessCode,
  getAccessCodeFromBookingId,
  updateAccessCode,
  deleteAccessCode,
};

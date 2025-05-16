import slugify from 'slugify'
import prisma from './database'

function generateSlug(name: string) {
  return slugify(name, { lower: true, strict: true })
}

async function updateSlugsForModel<T extends { id: string; name: string }>(
  modelName: keyof typeof prisma,
  table: { findMany: Function; update: Function; findFirst: Function }
) {
  const records: T[] = await table.findMany({
    where: {
      OR: [{ slug: null }, { slug: '' }]
    }
  })

  for (const record of records) {
    let baseSlug = generateSlug(record.name)
    let slug = baseSlug

    const existing = await table.findFirst({
      where: {
        slug,
        NOT: { id: record.id }
      }
    })

    if (existing) {
      slug = `${baseSlug}-${record.id.slice(0, 5)}`
    }

    await table.update({
      where: { id: record.id },
      data: { slug },
    })

    console.log(`[${modelName as string}] Updated slug for ${record.name} → ${slug}`)
  }
}

export async function slug() {
  await updateSlugsForModel('Brand' as keyof typeof prisma, prisma.brand)
  await updateSlugsForModel('Material' as keyof typeof prisma, prisma.material)
  await updateSlugsForModel('BandMaterial' as keyof typeof prisma, prisma.bandMaterial)
  await updateSlugsForModel('Movement' as keyof typeof prisma, prisma.movement)
  await updateSlugsForModel('Watch' as keyof typeof prisma, prisma.watch)
}


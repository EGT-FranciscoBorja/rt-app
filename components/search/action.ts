'use server'

export async function searchHotels(formData: FormData) {
  const searchQuery = formData.get('searchQuery');
  console.log(searchQuery);
}

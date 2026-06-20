export async function uploadBlob(publisherUrl, dataStr, epochs = 1) {
    const response = await fetch(`${publisherUrl}/v1/blobs?epochs=${epochs}`, {
        method: 'PUT',
        body: dataStr
    });
    if (!response.ok) {
        throw new Error(`Walrus upload failed: ${response.statusText}`);
    }
    const result = await response.json();
    let blobId = "";
    if (result.newlyCreated) {
        blobId = result.newlyCreated.blobObject.blobId;
    }
    else if (result.alreadyCertified) {
        blobId = result.alreadyCertified.blobId;
    }
    else {
        throw new Error("Failed to parse Blob ID from Walrus");
    }
    return blobId;
}
export async function downloadBlob(aggregatorUrl, blobId) {
    const response = await fetch(`${aggregatorUrl}/v1/blobs/${blobId}`);
    if (!response.ok) {
        throw new Error(`Failed to download blob from Walrus: ${response.statusText}`);
    }
    return await response.text();
}

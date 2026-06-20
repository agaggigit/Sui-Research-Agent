export async function uploadBlob(publisherUrl: string, dataStr: string, epochs: number = 1): Promise<string> {
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
    } else if (result.alreadyCertified) {
        blobId = result.alreadyCertified.blobId;
    } else {
        throw new Error("Failed to parse Blob ID from Walrus");
    }
    
    return blobId;
}

export async function downloadBlob(aggregatorUrl: string, blobId: string): Promise<string> {
    const response = await fetch(`${aggregatorUrl}/v1/blobs/${blobId}`);

    if (!response.ok) {
        throw new Error(`Failed to download blob from Walrus: ${response.statusText}`);
    }

    return await response.text();
}

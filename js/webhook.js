function sendWebhook(message) {
    var url = "https://discordapp.com/api/webhooks/458821739942772747/ZCz5KG2WOdtop6drnN1rmPp3UnjMVYFlX4AozX8n9iQCNfRkWewsc6OssRXBVnXM7Si9"
    var content = message;
    var username = "Test Webhook";
    var avatar_url = "";
    $.post(url,{"content": content, "username": username, "avatar_url": avatar_url},
    function(){
        console.log("Sent!");
    });
}

function testEmbed() {

    $.ajax({
        type: 'POST',
        // The webhook URL.
        url: "https://discordapp.com/api/webhooks/458821739942772747/ZCz5KG2WOdtop6drnN1rmPp3UnjMVYFlX4AozX8n9iQCNfRkWewsc6OssRXBVnXM7Si9",
        // Message data.
        data: JSON.stringify({
            // The username to be displayed.
            username: 'Joey Test Webhook',
            // The avatar to be displayed.
            avatar_url: 'https://cmkt-image-prd.global.ssl.fastly.net/0.1.0/ps/1770700/1160/772/m1/fpnw/wm0/black-cat-icon-flat-01-.jpg?1476726021&s=c956a64f60cd25e39dcd353c52e188a1',
            // Contents of the message to be sent.
            content: '',
            // Embeds to be sent.
            embeds: [{
                // Embed title - link on 2nd row.
                title: 'Title',
                // Embed description - text on 3rd row.
                description: 'Description',
                // Link for title and thumbnail.
                url: 'https://gist.github.com/TheDragonRing/ea61c8d21db17913a43da92efe0de634',
                // Decimal number colour of the side of the embed.
                color: 11730954,
                // Embed image - picture below description (and fields).
                image: {
                    url: 'https://cdn.discordapp.com/avatars/411256446638882837/9a12fc7810795ded801fdb0401db0be6.png'
                },
                // Embed author - icon next to text at top (text is a link).
                author: {
                    name: 'TheDragonRing',
                    url: 'https://thedragonring.me',
                    icon_url: 'https://avatars0.githubusercontent.com/u/16874139'
                },
                // Embed thumbnail - small image in top right corner.
                thumbnail: {
                    url: 'https://cdn.discordapp.com/avatars/411256446638882837/9a12fc7810795ded801fdb0401db0be6.png'
                },
                // Custom embed fields with a bold title/name, and normal content/value below title - located below description, above image.
                fields: [{
                    name: 'Field',
                    value: 'Field value'
                }],
                // Embed footer - icon next to text at bottom.
                footer: {
                    text: 'Footer',
                    icon_url: 'https://cdn.discordapp.com/avatars/411256446638882837/9a12fc7810795ded801fdb0401db0be6.png'
                }
            }]
        }),
        // Content type.
        contentType: 'application/json',
        // Success callback.
        success: function (data) { },
        // Error callback.
        error: function (data) {
          alert(data.responseText);
        }
      });
}
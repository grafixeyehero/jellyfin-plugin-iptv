using MediaBrowser.Channels.IPTV.Configuration;
using MediaBrowser.Model.MediaInfo;
using System.Linq;
using System.Net.Mime;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MediaBrowser.Channels.IPTV.Api
{
    /// <summary>
    /// The IP TV controller.
    /// </summary>
    [ApiController]
    [Route("[controller]")]
    [Produces(MediaTypeNames.Application.Json)]
    public class IptvController : ControllerBase
    {
        /// <summary>
        /// Bookmarks a video.
        /// </summary>
        /// <param name="name">The name.</param>
        /// <param name="path">The path.</param>
        /// <param name="userId">The user id.</param>
        /// <param name="protocol">The <see cref="MediaProtocol"/>.</param>
        /// <param name="imagePath">The image path.</param>
        /// <response code="204">Bookmark set successfully.</response>
        /// <returns>A <see cref="NoContentResult"/> indicting success.</returns>
        [HttpPost("Bookmarks")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public ActionResult SetBookmark(
            [FromQuery] string name,
            [FromQuery] string path,
            [FromQuery] string userId,
            [FromQuery] MediaProtocol protocol,
            [FromQuery] string imagePath)
        {
            var list = Plugin.Instance.Configuration.Bookmarks.ToList();
            list.Add(new Bookmark
            {
                UserId = userId,
                Name = name,
                Image = imagePath,
                Path = path,
                Protocol = protocol
            });

            Plugin.Instance.Configuration.Bookmarks = list.ToArray();

            Plugin.Instance.SaveConfiguration();
            return NoContent();
        }
    }
}
